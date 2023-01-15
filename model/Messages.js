/*
 *
 *
 ------->Title: message schema and message model
 ->Description: this file is to create schema and model for message database
 ------>Author: Shawon Talukder
 -------->Date: MM/DD/2023
 *
 *
 */
//dependencies
const mongoose = require("mongoose");

//creating the schema
const MessageSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    attachments: [
      {
        type: String,
      },
    ],
    sender: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    receiver: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    date_time: {
      type: Date,
      default: Date.now,
    },
    conversation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//create the model
const Messages = mongoose.model("Message", MessageSchema);

//export the model
module.exports = Messages;
