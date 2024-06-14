import * as userDao from "./userDao.js";
import { logger } from "../../../config/winston.js";

export const createUser = async (userId, userName) => {
  try {
    const existingUser = await userDao.selectUser(userId);
    if (existingUser) {
      return null;
    } else {
      const newUser = await userDao.createNewUser(userId, userName);
      return newUser;
    }
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return null;
  }
};

export const createResponse = async (requestData) => {
  try {
    const newResponse = await userDao.createNewResponse(requestData);
    return newResponse;
  } catch (err) {
    logger.error(`App - createResponse Service error\n: ${err.message}`);
    return null;
  }
};
