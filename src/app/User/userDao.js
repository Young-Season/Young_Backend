// 실제 DB 접근
import User from "../../models/user.js";

const selectAllUsers = async () => {
  await User.find()
    .then((users) => {
      return { users: users };
    })
    .catch((err) => {
      return err;
    });
};

export { selectAllUsers };
