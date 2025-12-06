import {asyncHandler} from "../utils/asyncHandler.js";
import {userModel} from "../models/userModel.js" 
import {upload} from"../middlewares/multer.middleware.js"
import {apiError} from "../utils/apiError.js"
import {uploadOperation} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"
const registerUser = asyncHandler(async(req,res)=>{
 const {username,email,fullname,password} = req.body
 if([username,email,fullname,password].some((field)=>field?.trim==="")){
  throw new apiError(400,"All fields are required")
 }
 const existingUser= await userModel.findOne({$or:[{username},{email}]}) //$or:[array of object required to be checked]
 if(existingUser){ 
  throw new apiError(400,"there exists an user with the provided credentials")
  }
    if(! req.files.avatar?.[0]?.path){
      throw new apiError(400,"avatar-path not found")
    }
    const avatarUpload = await uploadOperation(req.files.avatar?.[0]?.path)
    const coverImageUpload =  await uploadOperation(req.files.coverImage?.[0]?.path)
    if(!avatarUpload ){
      throw new apiError(400,"avatar-url not found")
    }
    const newUser= await userModel.create({
    email,
    username:username.toLowerCase(),
    fullname,
    password,
    avatar: avatarUpload.url,
    coverImage: coverImageUpload?.url || ""// check if there is one or not if not empty string will be passed 
  })
  const createdUser = await userModel.findById(newUser._id).select(
    "-password -refreshtoken"
  ) // what not to include in the object provided
  if(!createdUser){
    throw new apiError(500,"something went wrong while creating the user")
  }
 
 return res.status(201).json(
  new apiResponse(200,createdUser,"User registered Successfully")
 )

 

})
export {registerUser}