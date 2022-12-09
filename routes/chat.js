const express = require("express");
//import express from "express";
const router = express.Router();

const {
  getChat,
  getChats,
  /*createGroup,
  renameGroup,
  removeFromGroup,
  addUserToGroup
  */
} = require("../controllers/chat.js");
/*
import {
  getChat,
  getChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addUserToGroup,
} from "../controllers/chat.js";
*/

router.route("/").post(getChat).get(getChats);
/*
router.route("/createGroup").post(createGroup);
router.route("/renameGroup").patch(renameGroup);
router.route("/removeFromGroup").patch(removeFromGroup);
router.route("/addUserToGroup").patch(addUserToGroup);
*/

module.exports = router;
