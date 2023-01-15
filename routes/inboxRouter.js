/*
 *
 *
 ------->Title: inbox router
 ->Description: this is router file to handle inbox information
 ------>Author: Shawon Talukder
 -------->Date: 01/05/2023
 *
 *
 */

// Dependencies
const express = require("express");
const {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
} = require("../controllers/inboxController");
const decorateHTMLResponse = require("../middlewares/common/decorateHTMLresponse");
const { checkLogin } = require("../middlewares/common/checkLogin");
const attachmentUpload = require("../middlewares/inbox/attachmentUpload");

// Model Scaffolding
const router = express.Router();

// Model Structure
router.get("/", decorateHTMLResponse("Inbox"), checkLogin, getInbox);

//search user for conversation
router.post("/search", checkLogin, searchUser);

//add conversation
router.post("/conversation", checkLogin, addConversation);

//send message
router.post("/message", checkLogin, attachmentUpload, sendMessage);

//get messages of a conversation
router.get("/messages/:conversation_id", checkLogin, getMessages);

// Export Model
module.exports = router;
