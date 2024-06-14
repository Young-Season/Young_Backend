import mongoose from "mongoose";

const Schema = mongoose.Schema;

const descriptionSchema = new Schema(
  {
    result: {
      type: String,
      required: true,
      unique: true,
    },
    title: String,
    first: String,
    now: String,
  },
  {
    versionKey: false,
  }
);

const Description = mongoose.model("description", descriptionSchema);

export default Description;
