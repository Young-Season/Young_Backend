import mongoose from "mongoose";
import Friend from "./friend.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    animal: Number,
    emoji: Number,
    color: Number,
    first: Number,
    now: Number,
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Friend,
      },
    ],
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("user", userSchema);

export default User;