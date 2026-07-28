/*  
    video ObjectId videos
    owner ObjectId users
    content string
    createdAt date
    updatedAt date
*/

import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const commentSchema= new Schema({
    createdAt:{
        type: Date,
        required: true
    },
    updatedAt:{
        type: Date,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    video:{
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps: true
}
)

commentSchema.plugin(mongooseAggregatePaginate)

export const comment = mongoose.model("Comment", commentSchema)