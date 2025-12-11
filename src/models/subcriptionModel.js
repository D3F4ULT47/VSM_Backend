import mongoose from "mongoose"
const subcriptionSchema=mongoose.Schema({
  subcriber:{
    type:mongoose.Types.ObjectId,
    ref:"user"
  },
  channel:{
    type:mongoose.Types.ObjectId,
    ref:"user"
    }
},
{
  timestamps:true
})
export const subcriptionModel= mongoose.model("subcription",subcriptionSchema)