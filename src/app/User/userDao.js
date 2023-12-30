import User from "../../models/user.js";
import Friend from "../../models/friend.js";
import Description from "../../models/description.js";

export const selectAllUsers = async () => {
  const [users] = await User.find();
  return users;
};

export const selectUser = async (kakaoId) => {
  const user = await User.findOne({ id: kakaoId });
  return user;
};

export const createNewUser = async (userId, userName) => {
  const newUser = await User.create({ id: userId, name: userName });
  return newUser;
};

export const selectHostResult = async (hostId) => {
  const data = await User.findOne({ id: hostId });
  if (data.friends.length === 0) {
    return null;
  } else {
    let guestData = [];
    const getGuestData = data.friends.forEach(async (friend) => {
      const friendData = await Friend.findOne({ _id: friend });
      guestData.push({
        id: friendData._id,
        name: friendData.name,
      });
    });
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
