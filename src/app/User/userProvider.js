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

export const retrieveResults = async (hostId) => {
  const results = await userDao.selectResults(hostId);
  return results;
};

export const retrieveGuestResult = async (hostId, guestId) => {
  const guestResult = await userDao.selectGuestResult(hostId, guestId);
  if (guestResult.length == 0) return null;
  else {
    const guestData = {
      guestName: guestResult[0].name,
      animal: guestResult[0].animal,
      emoji: guestResult[0].emoji,
      color: guestResult[0].color,
      first: guestResult[0].first,
      now: guestResult[0].now,
    };
    console.log(guestData);
    return guestData;
  }
};
