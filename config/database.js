import mongoose from "mongoose";
import secrets from "../secrets.json" assert { type: "json" };

const connectDB = () =>
  mongoose
    .connect(secrets.MONGO_DB, {
      // useNewUrlPaser: true,
      // useUnifiedTofology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.log(err);
    });

export default connectDB;
