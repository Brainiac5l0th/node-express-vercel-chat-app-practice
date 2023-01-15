/*
 *
 *
 ------->Title: user model
 ->Description: this is to structure the users model
 ------>Author: Shawon Talukder
 -------->Date: 01/05/2022
 *
 *
 */

// Dependencies
const mongoose = require("mongoose");

// Model Structure
const peopleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const People = mongoose.model("People", peopleSchema);

// Export Model
module.exports = People;
