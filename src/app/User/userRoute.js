import * as user from "./userController.js";

const userRoute = (app) => {
  app.get("/users", user.getAllUsers); // for test
};

export default userRoute;
