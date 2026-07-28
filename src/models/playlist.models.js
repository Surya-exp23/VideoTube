   //!  Hints
   
   /*
   id string pk
    owner ObjectId users
    videos ObjectId[] videos
    name string
    description string
    createdAt date
    updatedAt date
   */

import mongoose,{Schema} from "mongoose";

const playlistSchema= new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true
    },
    UpdatedAt:{
        type: Date,
        required: true
    },
    owner:{
        type: Schema.type.ObjectId,
        ref:"User"
    },
    videos:{
        type:Schema.type.ObjectId,
        ref:"video"
    }
})

export const playlist = mongoose.model("Playlist",playlistSchema)