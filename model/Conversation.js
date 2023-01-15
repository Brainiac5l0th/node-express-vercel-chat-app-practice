/*
 *
 *
 ------->Title: conversation model
 ->Description: this model is to handle conversation datas
 ------>Author: Shawon Talukder
 -------->Date: 01/09/2023
 *
 *
 */

//dependencies
const mongoose = require("mongoose");

//model scaffolding
const conversationSchema = mongoose.Schema(
  {
    creator: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    participant: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
//create model againt schema
const Conversation = mongoose.model("Conversation", conversationSchema);

//export the model
module.exports = Conversation;
