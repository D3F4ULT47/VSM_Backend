import mongoose, { Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema = mongoose.Schema({
  videoFile:{
    type:String,
    required:true
  },
  thumbnail:{
    type:String,
    required:true,
  },
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  duration:{
    type:Number,
    required:true,
  },
  thumbnail:{
    type:Number,
    deafult:0
  },
  isPublishes:{
    type:Boolean,
    default:true,
  },
  owner:[
    {
    type:Schema.Types.ObjectId,
    ref:"user"
    }
]

},
{Timestamp:true}
)
videoSchema.plugin(mongooseAggregatePaginate)
export const videoModel=mongoose.model("video",videoSchema)