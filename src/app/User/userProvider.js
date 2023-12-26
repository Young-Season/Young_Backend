// 조회 관련 로직 처리

import * as userDao from "./userDao.js";

export const retrieveAllUsers = async () => {
  const userList = await userDao.selectAllUsers();
  console.log(userList); // undefined ???
  return userList;
};
