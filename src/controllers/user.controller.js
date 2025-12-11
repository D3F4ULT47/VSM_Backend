import {asyncHandler} from "../utils/asyncHandler.js";
import {userModel} from "../models/userModel.js" 
import {upload} from"../middlewares/multer.middleware.js"
import {apiError} from "../utils/apiError.js"
import {uploadOperation} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(Id)=>{
  try {
    const user = await userModel.findById(Id)
    const accessToken =user.generateAccessToken()
    const refreshToken =user.generateRefreshToken()
    user.refreshToken=refreshToken
    await user.save({ validateBeforeSave: false })

    return {accessToken,refreshToken}
    
  } catch (error) {
   throw new apiError (error.status,"Error while generating the tokens")
  }
}

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

const logInUser = asyncHandler(async(req,res)=>{
  const{email,password}=req.body
  if(!(email || password)){
    throw new apiError(400,"Atleast one field is required fields are required")
   }
  let existingUser= await userModel.findOne({email})
  if(existingUser){
   let validUser= await existingUser.isPasswordCorrect(password)
    if(!validUser){
     new apiError(401,"Invalid User Credentials")
    }   
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(existingUser._id)
    const loggedInUser= await userModel.findById(existingUser._id).
    select("-password -refreshToken")
    const options ={ // After this it can't be changed from frontEnd only from server
      httpOnly :true,
      secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new apiResponse(
        200,
        {
          user:loggedInUser,accessToken,
          refreshToken,
        },
        "User loggedIn Successfully"
      )
    )
  }
  else  throw new apiError(404,"User not found")
})
 
const logOutUser = asyncHandler(async(req,res)=>{
 await userModel.findOneAndUpdate(
   req.user._id,
    {
      $set :{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )
  const options ={ // After this it can't be changed from frontEnd only from server
    httpOnly :true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshTojke",options)
  .json(new apiResponse(200,{},"User Logged Out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
 try {
  const incomingRefreshToken=req.cookie.refreshToken || req.body.refreshToken  
   if(!incomingRefreshToken){
    throw new apiError(401,"Bad Request")
   }
   const decodedToken = jwt.verify(incomingRequestToken,process.env.REFRESH_TOKEN_SECRET)
   const requestingUser= await userModel.findById(decodedToken._id)
   if(!requestingUser){
     throw new apiError(401,"Bad Request")
   }
   if(requestingUser.refreshToken!==incomingRequestToken){
     throw new apiError(401,"Refresh Token is used or Expired")
   }
  const {accessToken,newRefreshToken}= await generateAccessAndRefreshTokens(requestingUser._id)
   const options ={ 
     httpOnly :true,
     secure:true
   }
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newRefreshToken,options)
   .json(
    new apiResponse(
     200,
     {
       accessToken,refreshToken:newRefreshToken
     },
     "Access token refreshed"
    )
   )
 } catch (error) {
  throw new apiError(404,error?.message||"Bad Request")
  
 }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
  const user = await userModel.findById(req.user._id)
  const {oldPassword,newPassword}=req.body
   if(!(oldPassword && newPassword)){
      new apiError(401,"All fields are required")
    }
  let Result = await user.isPasswordCorrect(oldPassword) 
   if(!Result){
     throw new apiError(400," Invalid Password")
    }
    user.password=newPassword
    await user.save({
      validatebeforeSave:false
    })
   return res
   .status(200)
   .json(
    new apiResponse(
      200,
      {},
      "password changed successfully"
    )
   )
  
})

const getCurrentUser= asyncHandler(async(req,res)=>{
 return res
 .status(200)
 .json(200,req.user,"current user fetched successfully")
})


export {
changeCurrentPassword,
refreshAccessToken,
logInUser,
registerUser,
logOutUser}

//"$2b$10$W1IgeZ8XSeNI4VSDDKf19.UC2E.kLe.xAyEii4okmdqL5Fnwg.i5a"
//"$2b$10$UahOHz54.8xaUIeRQ26wnuZzxmXzpwuyqB0YhKhqxK0VHYRODAthS"