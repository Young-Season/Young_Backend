import * as userDao from "./userDao.js";

export const createUser = async (userId, userName) => {
  const existingUser = await userDao.selectUser(userId);

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
