import axios from "axios";
import * as qs from "qs";
import jwt from "jsonwebtoken";
import * as baseResponse from "../../../config/baseResponseStatus.js";
import * as userProvider from "./userProvider.js";
import * as userService from "./userService.js";
import * as encryptUtil from "../../utils/encryption.js";
import secrets from "../../../secrets.json" assert { type: "json" };

export const getAllUsers = async (req, res) => {
  const userList = await userProvider.retrieveAllUsers();

  return res.send(userList["name"]);
};

export const redirectOauth = async (req, res) => {
  return res.redirect(
    `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${secrets.KAKAO_API_KEY}&redirect_uri=${secrets.KAKAO_REDIRECT_URI}`
  );
};

export const oauthCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const kakaoToken = await axios({
      // 토큰 발급
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        grant_type: "authorization_code",
        client_id: secrets.KAKAO_API_KEY,
        redirect_uri: secrets.KAKAO_REDIRECT_URI,
        code: code,
        client_secret: secrets.KAKAO_CLIENT_SECRET,
      }),
    });

    const kakaoUserInfo = await axios({
      // access token으로 카카오 사용자 정보 가져오기
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${kakaoToken.data.access_token}`,
      },
    });

    const userId = encryptUtil.encrypt(kakaoUserInfo.data.id);

    const user = await userProvider.retrieveUser(userId);
    if (user) {
      const token = jwt.sign(
        {
          type: "JWT",
          id: userId,
          name: user.name,
        },
        secrets.JWT_SECRET,
        {
          expiresIn: "30m",
        }
      );

      return res.send({
        status: "200",
        message: "Login Success",
        id: userId,
        hostName: user.name,
        token: token,
      });
    } else {
      return res.send({
        status: "404",
        message: "Signup Required",
        id: userId,
      });
    }
  } catch (err) {
    console.log(err);
    return res.send(baseResponse.BAD_REQUEST);
  }
};

export const userSignUp = async (req, res) => {
  const userId = req.body["id"];
  const userName = req.body["name"];

  const newUser = await userService.createUser(userId, userName);
  if (newUser === null) {
    const token = jwt.sign(
      {
        type: "JWT",
        id: userId,
        name: userName,
      },
      secrets.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );

    return res.send({
      status: "201",
      message: "New User Created",
      data: {
        id: userId,
        name: userName,
        token: token,
      },
    });
  } else return res.send(baseResponse.DUP_USER);
};

export const getHostResult = async (req, res) => {
  const hostId = req.params.hostId;

  try {
    const token = req.header("token");
    const payload = jwt.verify(token, secrets.JWT_SECRET);
    if (payload.id != hostId) throw new Error("Unauthorized");
  } catch (err) {
    return res.send(baseResponse.UNAUTHOURIZED);
  }

  const resultData = await userProvider.retrieveHostResult(hostId);

  if (resultData) {
    return res.send({
      status: "200",
      message: "User Results",
      data: resultData,
    });
  } else {
    return res.send({
      status: "204",
      message: "No Result Yet",
      data: {
        image: "000",
      },
    });
  }
};

export const postResponse = async (req, res) => {
  const hostId = req.body["hostId"];

  const hostUser = await userProvider.retrieveUser(hostId);
  if (!hostUser) {
    return res.send(baseResponse.USER_NOT_FOUND);
  }
  const hostName = hostUser.name;

  const newResponse = await userService.createResponse(req.body);
  if (newResponse) {
    const descData = await userProvider.retrieveDescription(
      `${req.body["first"]}${req.body["now"]}`
    );

    return res.send({
      status: "201",
      message: "Response Save Success",
      data: {
        hostId: String(hostId),
        hostName: hostName,
        guestName: req.body["guestName"],
        animal: req.body["animal"],
        emoji: req.body["emoji"],
        color: req.body["color"],
        title: descData.title,
        first: descData.first,
        now: descData.now,
      },
    });
  } else return res.send(baseResponse.BAD_REQUEST);
};

export const getResult = async (req, res) => {
  const hostId = req.params.hostId;

  const result = await userProvider.retrieveResult(hostId);
  if (result)
    return res.send({
      status: "200",
      message: "Result for given host",
      hostId: result.hostId,
      hostName: result.hostName,
      data: result.data,
    });
  else return res.send(baseResponse.USER_NOT_FOUND);
};

export const getGuestResult = async (req, res) => {
  const hostId = req.params.hostId;
  const guestId = req.params.guestId;

  try {
    const token = req.header("token");
    const payload = jwt.verify(token, secrets.JWT_SECRET);
    if (payload.id != hostId) throw new Error("Unauthorized");
  } catch (err) {
    return res.send(baseResponse.UNAUTHOURIZED);
  }

  const resultData = await userProvider.retrieveGuestResult(hostId, guestId);
  if (resultData)
    return res.send({
      status: "200",
      message: "Guest Result",
      data: resultData,
    });
  else return res.send(baseResponse.BAD_REQUEST);
};

export const getStats = async (req, res) => {
  const hostId = req.params.hostId;

  try {
    const token = req.header("token");
    const payload = jwt.verify(token, secrets.JWT_SECRET);
    if (payload.id != hostId) throw new Error("Unauthorized");
  } catch (err) {
    return res.send(baseResponse.UNAUTHOURIZED);
  }

  const statsResult = await userProvider.retrieveStats(hostId);
  if (statsResult) {
    return res.send({
      status: "200",
      message: "Stats Result",
      data: statsResult,
    });
  } else {
    return res.send({
      status: "204",
      message: "No Result Yet",
    });
  }
};

export const getGuestNamesAndCheckDup = async (req, res) => {
  const hostId = req.query.hostId;
  const guestNameProvided = req.query.name;
  const guestName = guestNameProvided.replace("+", " ");
  const user = await userProvider.retrieveUser(hostId);
  if (!user) {
    return res.send(baseResponse.USER_NOT_FOUND);
  } else {
    const guestNames = user.friends.map((friend) => friend.name);
    if (guestNames.includes(guestName)) {
      return res.send({
        status: "409",
        message: "Nickname Duplicated",
        name: guestName,
      });
    } else {
      return res.send({
        status: "200",
        message: "Nickname Available",
        name: guestName,
      });
    }
  }
};

export const getNames = async (req, res) => {
  const hostId = String(req.query.hostId);

  const result = await userProvider.retrieveUser(hostId);
  if (result)
    return res.send({
      status: "200",
      message: "Host name for Landing Page",
      hostName: result.name,
    });
  else return res.send(baseResponse.USER_NOT_FOUND);
};
