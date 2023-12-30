import * as userDao from "./userDao.js";

const arrName = ["animal", "emoji", "color", "first", "now"];

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
    const guestData = hostData.friends.map((friend) => ({
      id: friend._id,
      name: friend.name,
    }));

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
      ...guestResult[0]._doc,
    };
    delete guestData._id;
    return guestData;
  }
};

export const retrieveStats = async (hostId) => {
  const userData = await userDao.selectUser(hostId);
  const total = userData.animal.reduce((sum, val) => sum + val, 0);

  if (total === 0) {
    return null;
  } else {
    let result = {};
    arrName.forEach((name, idx) => {
      const arr = userData[name];
      const first = Math.max(...arr);
      const firstIdx = arr.indexOf(first);
      const firstObj = {
        [name]: firstIdx,
        percent: Math.floor((first / total) * 100),
      };

      arr[firstIdx] = 0;
      const second = Math.max(...arr);
      const secondObj = {
        [name]: arr.indexOf(second),
        percent: Math.floor((second / total) * 100),
      };
      result[name] = [firstObj, secondObj];
    });

    return result;
  }
};
