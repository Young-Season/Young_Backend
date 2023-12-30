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
  const data = await userDao.selectHostResult(hostId);
  if (data) {
    const hostData = data["hostData"];
    const descData = data["descData"];
    const guestData = data["guestData"];

    const image = `${hostData.animal}${hostData.emoji}${hostData.color}`;

    const resultData = {
      image: image,
      title: descData.title,
      first: descData.first,
      now: descData.now,
      guests: guestData,
    };
    return resultData;
  } else {
    return null;
  }
};
