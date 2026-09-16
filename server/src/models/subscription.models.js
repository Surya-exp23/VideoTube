/*
  subscriber ObjectId users
  channel ObjectId users
  createdAt date
  updatedAt date
  */

  import mongoose,{Schema} from "mongoose"; 

  const SubscriptionSchema = new Schema({

        createdAt:{
            type: Date,
            required: true
        },
        updatedAt:{
            type: Date,
            required: true
        },
        channel:{
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        subscriber:{
            type: Schema.Types.ObjectId,
            ref:"User"
        }

  },{
    timestamps: true
  }
)

export const subscription = mongoose.model("Subscription", SubscriptionSchema)