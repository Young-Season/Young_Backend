import * as userDao from "./userDao.js";

export const createUser = async (userId, userName) => {
  const newUser = await userDao.createNewUser(userId, userName);
  return newUser;
};

export const createResponse = async (requestData) => {
  const newResponse = await userDao.createNewResponse(requestData);
  return newResponse;
};
