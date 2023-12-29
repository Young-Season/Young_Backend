// 실제 DB 접근
import User from "../../models/user.js";

export const selectAllUsers = async () => {
  const [users] = await User.find();
  return users;
};

export const selectUser = async (kakaoId) => {
  const user = await User.findOne({ kakaoId: kakaoId });
  return user;
};

export const createNewUser = async (userId, userName) => {
  const newUser = await User.insertMany({ kakaoId: userId, name: userName });
  return newUser;
};
