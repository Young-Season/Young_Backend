import express from "express";
import userRoute from "../src/app/User/userRoute.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static('public'));

userRoute(app);

export default app;
