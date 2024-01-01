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
  const userData = await userDao.selectUser(hostId);
  if (userData.friends.length === 0) return null;
  else {
    const guestData = userData.friends.map((friend) => ({
      id: friend._id,
      name: friend.name,
    }));

    let firsts = {};
    arrName.forEach((name, idx) => {
      const arr = userData[name];
      const first = Math.max(...arr);
      firsts[name] = arr.indexOf(first);
    });

    const image = `${firsts["color"]}${firsts["emoji"]}${firsts["animal"]}`;
    const descData = await userDao.selectDescription(
      `${firsts["first"]}${firsts["now"]}`
    );

    const resultData = {
      image: image,
      title: descData.title,
      first: descData.first,
      now: descData.now,
      guests: guestData,
    };
    return resultData;
  }
};

export const retrieveResult = async (hostId) => {
  const userData = await userDao.selectUser(hostId);

  if (userData) {
    let firsts = {};
    arrName.forEach((name, idx) => {
      const arr = userData[name];
      const first = Math.max(...arr);
      firsts[name] = arr.indexOf(first);
    });

    const descData = await userDao.selectDescription(
      `${firsts["first"]}${firsts["now"]}`
    );

    const result = {
      hostId: String(userData.id),
      hostName: userData.name,
      data: {
        animal: firsts["animal"],
        emoji: firsts["emoji"],
        color: firsts["color"],
        title: descData.title,
        first: descData.first,
        now: descData.now,
      },
    };
    return result;
  } else {
    return null;
  }
};

export const retrieveGuestResult = async (hostId, guestId) => {
  const userData = await userDao.selectUser(hostId);
  const guestResult = userData.friends.filter((item) => item._id == guestId);
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

export const retrieveDescription = async (resultId) => {
  const descData = await userDao.selectDescription(resultId);
  return descData;
};
