const { StatusCodes } = require("http-status-codes");
//import { StatusCodes } from "http-status-codes";
const Chat = require("../models/chat.js");
//import Chat from "../models/chat.js";
const User = require("../models/user.js");
//import User from "../models/user.js";

const {
  BadRequestError
} = require("../errors/index.js");

const getChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.send("No User Exists!");
  }

  console.log("here1");

  let chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "username avatar email fullName _id",
  });
  console.log("here2");

  if (chat.length > 0) {
    res.send(chat[0]);
  } else {
    const createChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    });

    const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
      "users",
      "-password"
    );

    res.status(StatusCodes.OK).json(fullChat);
  }
};

const getChats = async (req, res) => {
  const chat = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  const user = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "username avatar email fullName _id",
  });

  res.status(StatusCodes.OK).json(user);
};



module.exports = {
  getChat,
  getChats
};
