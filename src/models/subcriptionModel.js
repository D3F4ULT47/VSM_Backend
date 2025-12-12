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
// this will create sets of 
// -an individual channel and the subcriber
// * To figure no of subcriber of a channel 
// we can just filter out  we can just filter out with ,channel:"name/username"
// & the no of sets will give us no of subcribers
// similarly 
// * To figure no of channel, 
//-subcribed by a specific subscriber
// we can just filter out with ,subcriber: "name/username"
// * both channel and subcriber are extensions of user * 
