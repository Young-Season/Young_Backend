// 조회 관련 로직 처리

import * as userDao from "./userDao.js";
// import userDto from "./userDto.js";

export const retrieveAllUsers = async () => {
  // 그냥 get이라 dto 안 씀
  const userList = userDao.selectAllUsers();

  return userList;
};
