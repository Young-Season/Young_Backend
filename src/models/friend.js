import mongoose from "mongoose";

const Schema = mongoose.Schema;

const friendSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    animal: String,
    emoji: String,
    color: String,
    first: String,
    now: String,
    image: String,
  },
  {
    versionKey: false,
  }
);

const Friend = mongoose.model("friend", friendSchema);

export default Friend;
