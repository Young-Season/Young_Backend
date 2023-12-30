import axios from "axios";
import * as qs from "qs";
import * as baseResponse from "../../../config/baseResponseStatus.js";
import * as userProvider from "./userProvider.js";
import * as userService from "./userService.js";
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
    const token = await axios({
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
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
    console.log(kakaoUserInfo.data);
    const user = await userProvider.retrieveUser(kakaoUserInfo.data.id);
    if (user) {
      return res.send({
        status: "200",
        message: "Login Success",
        id: kakaoUserInfo.data.id,
        "host-name": user.name,
      });
    } else {
      return res.send({
        status: "404",
        message: "Signup Required",
        id: kakaoUserInfo.data.id,
      });
    }
  } catch (err) {
    console.log(err);
    return res.send(baseResponse.BAD_REQUEST);
  }
};

export const userSignUp = async (req, res) => {
  const userId = req.body["kakaoId"];
  const userName = req.body["name"];

  const newUser = await userService.createUser(userId, userName);
  if (newUser)
    return res.send({
      status: "201",
      message: "New User Created",
      data: {
        id: userId,
        name: userName,
      },
    });
  else return res.send(baseResponse.BAD_REQUEST);
};

export const getHostResult = async (req, res) => {
  const hostId = req.params.hostId;

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

  // and add user data to db of host
  const newResponse = await userService.createResponse(req.body);
  if (newResponse)
    return res.send({
      status: "201",
      message: "Response Save Success",
      data: {
        hostId: hostId,
        hostName: hostName,
        guestName: req.body["guestName"],
        animal: req.body["animal"],
        emoji: req.body["emoji"],
        color: req.body["color"],
        first: req.body["first"],
        now: req.body["now"],
      },
    });
  else return res.send(baseResponse.BAD_REQUEST);
};
