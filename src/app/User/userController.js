import { response } from "express";
import * as baseResponseStatus from "../../../config/baseResponseStatus.js";
import * as userProvider from "./userProvider.js";
import * as userService from "./userService.js";

export const getAllUsers = async (req, res) => {
  const userList = await userProvider.retrieveAllUsers();

  return res.send(userList);
};
