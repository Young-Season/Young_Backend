// 생성, 업데이트, 삭제 관련 로직

import * as userDao from "./userDao.js";

export const createUser = async (userId, userName) => {
  const newUser = await userDao.createNewUser(userId, userName);
  return newUser;
};
