/*
 *
 *
 ------->Title: inbox controller
 ->Description: this controller is to handle all inbox related data
 ------>Author: Shawon Talukder
 -------->Date: 01/05/2023
 *
 *
 */
//dependencies
const Conversation = require("../model/Conversation");
const User = require("../model/People");
const Message = require("../model/Messages");
const createError = require("http-errors");
const escape = require("../utilities/escape");

//to render inbox page
const getInbox = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });
    res.locals.data = conversations;
    res.render("inbox");
  } catch (err) {
    next(err);
  }
};

//search a user
const searchUser = async (req, res, next) => {
  const user = req.body.user;
  const searchQuery = user.replace("+880", "");
  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");
  try {
    if (searchQuery !== "") {
      const users = await User.find(
        {
          $or: [
            { name: name_search_regex },
            { mobile: mobile_search_regex },
            { email: email_search_regex },
          ],
        },
        "name avatar"
      );
      res.json(users);
    } else {
      throw createError("Must provide some text to search");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.msg,
        },
      },
    });
  }
};

//add conversation
const addConversation = async (req, res, next) => {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        id: req.body.id,
        name: req.body.participant,
        avatar: req.body.avatar || null,
      },
    });
    const result = await newConversation.save();

    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.msg,
        },
      },
    });
  }
};

//get all messages of a conversation
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
};

//send message
async function sendMessage  (req, res, next) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      let attachments = null;
      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

      // emit socket event
      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid,
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });

      res.status(200).json({
        message: "Successful!",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "message text or attachment is required!",
      },
    });
  }
};

// export
module.exports = {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
};
