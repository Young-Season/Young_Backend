import User from "../../models/user.js";
import Friend from "../../models/friend.js";
import Description from "../../models/description.js";

export const selectAllUsers = async () => {
  const [users] = await User.find();
  return users;
};

export const selectUser = async (kakaoId) => {
  const user = await User.findOne({ kakaoId: kakaoId });
  return user;
};

export const createNewUser = async (userId, userName) => {
  const newUser = await User.create({ kakaoId: userId, name: userName });
  return newUser;
};

export const selectHostData = async (hostId) => {
  const hostData = await User.findOne({ kakaoId: hostId });
  if (hostData.friends.length === 0) {
    return null;
  } else {
    const guestData = await User.findOne({ kakaoId: hostId }).populate(
      "friends"
    );
    return guestData;
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
      { kakaoId: requestData["hostId"] },
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
