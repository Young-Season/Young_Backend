import * as userDao from "./userDao.js";
import User from "../../models/user.js";

export const createUser = async (userId, userName) => {
  const existingUser = await User.findOne({ id: userId });

  if (existingUser) {
    return existingUser;
  } else {
    const newUser = await userDao.createNewUser(userId, userName);
    return null;
  }
};

export const createResponse = async (requestData) => {
  const newResponse = await userDao.createNewResponse(requestData);
  return newResponse;
};
