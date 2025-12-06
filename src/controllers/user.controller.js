import { asyncHandler } from "../utils/asyncHandler.js";
import {userModel} from "../models/userModel.js" 
import {upload} from"../middlewares/multer.middleware.js"
const registerUser = asyncHandler( async(req,res)=>{
 const {username,email,fullname,password} = req.body
 console.log("email:",email)
  res.json({ 
    success: true 
  });
})
export {registerUser}