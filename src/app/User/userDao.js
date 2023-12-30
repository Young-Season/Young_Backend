import User from "../../models/user.js";
import Friend from "../../models/friend.js";
import Description from "../../models/description.js";

export const selectAllUsers = async () => {
  const [users] = await User.find();
  return users;
};

export const selectUser = async (userId) => {
  const user = await User.findOne({ id: userId });
  return user;
};

export const createNewUser = async (userId, userName) => {
  const newUser = await User.create({ id: userId, name: userName });
  return newUser;
};

export const selectHostResult = async (hostId) => {
  const data = await User.findOne({ id: hostId }).populate("friends");

  if (data.friends.length === 0) {
    return null;
  } else {
    const guestData = data.friends.map((friend) => ({
      id: friend._id,
      name: friend.name,
    }));

    const descData = await Description.findOne({
      result: `${data.first}${data.now}`,
    });
    return { hostData: data, descData: descData, guestData: guestData };
  }
};

export const createNewResponse = async (requestData) => {
  // image 계산해서 image: "..."처럼 friend에 string으로 추가 필요

  try {
    const newFriend = await Friend.create({
      name: requestData["guestName"],
      animal: requestData["animal"],
      emoji: requestData["emoji"],
      color: requestData["color"],
      first: requestData["first"],
      now: requestData["now"],
    });

    const updatedUser = await User.findOneAndUpdate(
      // User의 friends 배열에 응답id 추가
      { id: requestData["hostId"] },
      { $push: { friends: newFriend._id } },
      { new: true }
    ).exec();

    // 항목별 응답수 계산해서 항목+이미지 대표값 수정하는 코드 추가 필요 populate 활용 예상
    return updatedUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const selectResults = async (hostId) => {
  const user = await User.findOne({ id: hostId }).populate("friends");
  if (user) {
    const results = {
      hostId: String(user.id),
      hostName: user.name,
      data: user.friends.map((friend) => ({
        guestName: friend.name,
        animal: friend.animal,
        emoji: friend.emoji,
        color: friend.color,
        first: friend.first,
        now: friend.now,
      })),
    };
    return results;
  } else {
    return null;
  }
};

export const selectGuestResult = async (hostId, guestId) => {
  const userData = await User.findOne({ id: hostId }).populate("friends");
  const guestData = userData.friends.filter((item) => item._id == guestId);
  return guestData;
};
