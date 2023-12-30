import * as userDao from "./userDao.js";

export const retrieveAllUsers = async () => {
  const userList = await userDao.selectAllUsers();
  return userList;
};

export const retrieveUser = async (userId) => {
  const user = await userDao.selectUser(userId);
  return user;
};

export const retrieveHostResult = async (hostId) => {
  const resultData = await userDao.selectHostResult(hostId);
  return resultData;
};

export const retrieveResults = async (hostId) => {
  const results = await userDao.selectResults(hostId);
  return results;
};