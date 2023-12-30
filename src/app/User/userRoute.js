import * as user from "./userController.js";

const userRoute = (app) => {
  app.get("/users", user.getAllUsers); // for test

  app.get("/oauth/kakao", user.redirectOauth);
  app.get("/oauth/kakao/callback", user.oauthCallback);

  app.post("/signup", user.userSignUp);

  app.get("/data/:host-id", user.getHostResult);

  app.post("/responses", user.postResponse);
  app.get("/results", user.getResults);
};

export default userRoute;
