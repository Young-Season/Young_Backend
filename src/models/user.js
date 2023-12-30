import mongoose from "mongoose";
import Friend from "./friend.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    kakaoId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    animal: String,
    emoji: String,
    color: String,
    first: String,
    now: String,
    image: String,
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friend",
      },
    ],
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("user", userSchema);

export default User;
