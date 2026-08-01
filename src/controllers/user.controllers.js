import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { urlencoded } from "express";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{

    const {fullName, email, username, password}=req.body

    //validation
    if([fullName,email,username,password].some((field)=> field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser=User.findOne({
        $or: [{username},{email}] // good method to check for mutliple things in mongodb
    })

    if(existedUser){
        throw new ApiError(409,"user with email or username already exists")
    }

   const avatarLocalPath = req.files?.avatar[0]?.path
   const coverLocalPath = req.files?.coverImage[0]?.path

   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
   }

   const avatar=await uploadOnCloudinary(avatarLocalPath)
   let coverImage="";
   if(coverLocalPath){
       coverImage = await uploadOnCloudinary(coverLocalPath)
   }

   const user=await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.tolowercase()
   })


   const createdUser = await User.findById(user._id).select(
       "-password -refreshToken"  // here we removed the fields so mongodb will not select password and refreshToken
   )

   if(!createdUser){
    throw new ApiError(500,"Something went wrong")
   }

   return res.status(2001).json(new ApiResponse(200, createdUser, "user registered succesfully"))



})

export{
    registerUser
}