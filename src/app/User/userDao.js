// 실제 DB 접근
import { collection, getDocs } from "firebase/firestore";
import db from "../../../config/firebase.js";

const selectAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  var userList = [];
  snapshot.forEach((user) => {
    var userData = user.data();
    userList.push(userData);
  });
  return userList;
};

export { selectAllUsers };
