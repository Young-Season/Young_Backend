import * as userDao from "./userDao.js";

export const retrieveAllUsers = async () => {
  const userList = await userDao.selectAllUsers();
  return userList;
};

export const retrieveUser = async (kakaoId) => {
  const user = await userDao.selectUser(kakaoId);
  return user;
};
