import mongoose from "mongoose";

const Schema = mongoose.Schema;

const friendSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    animal: Number,
    emoji: Number,
    color: Number,
    first: Number,
    now: Number,
  },
  {
    versionKey: false,
  }
);

const Friend = mongoose.model("friend", friendSchema);

export default Friend;
