import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = mongoose.Schema({
username:{
   type:String,
   required:true,
   unique:true,
   lowercase:true,
   trim:true,
   index:true
},
email:{
   type:String,
   required:true,
   unique:true,
   lowercase:true,
   trim:true,
},
fullname:{
  type:String,
  required:true, 
  trim:true,
  index:true
},
avatar:{
  type:String,// cloudinary url
  required:true,
},
coverImage:{
  type:String,
},
password:{
  type:String,
  required:[true,"password is required"],
  trim:true,
  index:true
},
watchHistory:[
  {
      type:Schema.Types.ObjectId,
      ref:"video"
  }
],
refreshToken:{ 
  type:String,
}
},
{Timestamp:true}
)
// pre runs right before this model will be getting saved 
userSchema.pre("save", async function() { //next as a variable
  if (!this.isModified("password")) return ; // next was returned

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});

userSchema.methods.isPasswordCorrect = async function (password) {
 return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function(){
  const accessToken = jwt.sign(
    {
      _id:this._id,
      username:this.username
    }, 
      process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:ACCESS_TOKEN_EXPIRY
    })
} 
userSchema.methods.generateRefreshToken = function(){
  const refreshToken = jwt.sign(
    {
      _id:this._id,
      username:this.username
    }, 
      process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
} 
export const userModel = mongoose.model("user",userSchema)