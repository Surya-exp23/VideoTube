/*
  owner ObjectId users
  content string
  createdAt date
  updatedAt date
*/

import mongoose, { model, Schema } from "mongoose";

const tweetSchema = new Schema({

    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true
    },
    updatedAt:{
        type: Date,
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps: true
}
)

export const Tweet = mongoose.model("Tweet",tweetSchema)

