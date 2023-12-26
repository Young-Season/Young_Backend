// 실제 DB 접근
import User from "../../models/user.js";

export const selectAllUsers = async () => {
  const [users] = await User.find();
  return users;
};
