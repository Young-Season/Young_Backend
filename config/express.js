import express from "express";
import userRoute from "../src/app/User/userRoute.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

userRoute(app);

export default app;
