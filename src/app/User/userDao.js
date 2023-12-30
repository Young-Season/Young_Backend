import User from "../../models/user.js";
import Friend from "../../models/friend.js";
import Description from "../../models/description.js";

export const selectAllUsers = async () => {
  const [users] = await User.find();
  return users;
};

export const selectUser = async (userId) => {
  const user = await User.findOne({ id: userId }).populate("friends");
  return user;
};

export const createNewUser = async (userId, userName) => {
  const zeroArray = Array(9).fill(0);
  const newUser = await User.create({
    id: userId,
    name: userName,
    animal: zeroArray,
    emoji: zeroArray,
    color: zeroArray,
    first: zeroArray,
    now: zeroArray,
  });
  return newUser;
};

export const selectDescription = async (resultId) => {
  const descData = await Description.findOne({ result: resultId });
  return descData;
};

export const createNewResponse = async (requestData) => {
  try {
    const { hostId, guestName, animal, emoji, color, first, now } = requestData;

    const newFriend = await Friend.create({
      name: guestName,
      animal: animal,
      emoji: emoji,
      color: color,
      first: first,
      now: now,
    });

    const updatedUser = await User.findOneAndUpdate(
      { id: hostId },
      {
        $push: { friends: newFriend._id },
        $inc: {
          [`animal.${animal}`]: 1,
          [`emoji.${emoji}`]: 1,
          [`color.${color}`]: 1,
          [`first.${first}`]: 1,
          [`now.${now}`]: 1,
        },
      },
      { new: true }
    ).exec();

    return updatedUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const selectResults = async (hostId) => {
  const user = await User.findOne({ id: hostId }).populate("friends");
  if (user) {
    const results = {
      hostId: String(user.id),
      hostName: user.name,
      data: user.friends.map((friend) => ({
        guestName: friend.name,
        animal: friend.animal,
        emoji: friend.emoji,
        color: friend.color,
        first: friend.first,
        now: friend.now,
      })),
    };
    return results;
  } else {
    return null;
  }
};
