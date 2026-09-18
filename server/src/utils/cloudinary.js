import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv";

dotenv.config()

// configuration

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(
            localFilePath,{
                resource_type: "auto"
            }
        )
        console.log("file uploaded on cloudinary:", response.url)
        // once file is uploaded , we would like to delete it from our servesr
        try {
            fs.unlinkSync(localFilePath)
        } catch (e) {
            console.log("Could not delete local file:", e)
        }
        return response
    }catch(error){
        console.log("Cloudinary upload failed:", error)
        try {
            fs.unlinkSync(localFilePath)
        } catch (e) {}
        return null
    }
}


const deleteFromCloudinary = async (publicId) =>{
    try{
        const result=cloudinary.uploader.destroy(publicId);
        console.log("deleted from cloudinary", publicId);
    }catch(error){
        console.log("Error deleting from cloudinary",error)
        return null
    }
}


export {uploadOnCloudinary, deleteFromCloudinary}