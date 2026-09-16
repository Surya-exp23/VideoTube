/*  video ObjectId videos
  comment ObjectId comments
  tweet ObjectId tweets
  likedby ObjectId users
  createdAt date
  updatedAt date
*/

import mongoose, {Schema} from "mongoose";

const likesSchema= new Schema({
    createdAt:{
        type: Date,
        required: true
    },
    updatedAt:{
        type: Date,
        required: true
    },
    video:{
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref:"Comment"
    },
    tweet:{
        type: Schema.Types.ObjectId,
        ref:"Tweet"
    },
    likedby:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
}
)


export const Likes=mongoose.model("Likes", likesSchema)