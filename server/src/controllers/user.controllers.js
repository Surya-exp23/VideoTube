import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js";
import { urlencoded } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        // small check we will do later
    
        const accessToken=user.generateAccessToken()
        const refreshToken =user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh tokens")
    }
}


const registerUser = asyncHandler(async (req,res)=>{

    const {fullname, email, username, password}=req.body

    //validation
    if([fullname,email,username,password].some((field)=> field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser=await User.findOne({
        $or: [{username},{email}] // good method to check for mutliple things in mongodb
    })

    if(existedUser){
        throw new ApiError(409,"user with email or username already exists")
    }

   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverLocalPath = req.files?.coverImage?.[0]?.path;

   let avatar = null;
   if (avatarLocalPath) {
       try {
            avatar = await uploadOnCloudinary(avatarLocalPath);
            if (!avatar) throw new Error("Cloudinary upload returned null");
       } catch(error) {
            console.log("Error uploading avatar", error);
            throw new ApiError(500, "Cloudinary upload failed for avatar.");
       }
   }

   let coverImage = null;
   if (coverLocalPath) {
       try {
            coverImage = await uploadOnCloudinary(coverLocalPath);
       } catch(error) { 
            console.log("Error uploading coverimage", error);
       }
   }

   try {
    const user=await User.create({
     fullname,
     avatar: avatar?.url || "",
     coverImage: coverImage?.url || "",
     email,
     password,
     username: username.toLowerCase()
    })
 
 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"  // here we removed the fields so mongodb will not select password and refreshToken
    )
 
    if(!createdUser){
     throw new ApiError(500,"Something went wrong")
    }
 
    return res.status(201).json(new ApiResponse(200, createdUser, "user registered succesfully"))
   } catch (error) {
    console.log("user creation is failed", error);
    if(avatar){
        await deleteFromCloudinary(avatar.public_id)
    }
    if(coverImage){
        await deleteFromCloudinary(coverImage.public_id)
    }

    throw new ApiError(500, error?.message || "Something went wrong")
   }



})


const loginUser = asyncHandler(async (req,res) =>{
    // get data from body
    const {email ,username, password} = req.body

    // validation
    if(!email){
        throw new ApiError(400, "email is required");
    }

    const user=await User.findOne({
        $or: [{username},{email}] 
    })

    if(!user){
        throw new ApiError(404,"User not found")
    }


    //validation  password

    const isPasswordValid =  await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Give the correct password");
    }

    const {accessToken , refreshToken } = await generateAccessTokenAndRefreshToken(user._id);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    if(!loggedInUser){
        throw new ApiError(401, "User not found");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV==="production"
    }


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json( new ApiResponse(200, 
            { user: loggedInUser, accessToken, refreshToken }, 
            "User logged in successfully"
        ))

})

// now logout feature implementation
const logoutUser = asyncHandler(async (req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined,
            }
        },
        {new: true}
    )
    const options={
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})



const refreshAccessToken = asyncHandler( async( req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh Token is required");
    }


    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user= await User.findById(decodedToken?._id) // here ? is optentional chaining operator which will check if decodedToken is not null or undefined then only it will access _id property

        if(!user){
            throw new ApiError(401, "invalid refresh token");
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "invalid refresh token");
        }

        const options={
            httpOnly: true,
            secure: process.env.NODE_ENV==="production"
        }
        // this code is best practice for secure cookies and its used in production environment

        const {accessToken, refreshToken: newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    {
                        accessToken, 
                        refreshToken: newRefreshToken
                    }, 
                    "Access token refreshed successfully"
                ))

    } catch (jwt) {
        throw new ApiError(500, "something went wrong while refreshing access token");
    }
})


const changecurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))

})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200, req.user, "Current user details"))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname, email} = req.body
    if(!fullname || !email ){
        throw new ApiError(400, "Fullname and email are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname,
                email: email
            }
        },
        {new: true}   //By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied. Use returnDocument: 'after' instead of new: true, or returnDocument: 'before' instead of new: false.


    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, user, "account details updated succesfully"));

})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path 

    if(!avatarLocalPath){
        throw new ApiError(400, "File is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar || !avatar.url){
        throw new ApiError(500, "Something went wrong while uploading the avatar to Cloudinary. Check your Cloudinary keys.")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, user, "avatar updated succesfully"));
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400, "file is required")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage || !coverImage.url){
        throw new ApiError(500, "Something went wrong while uploading cover image to Cloudinary. Check your Cloudinary keys.")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}

    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, user, "Cover Image succesfully"));

})


export{
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    changecurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}