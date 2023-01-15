/*
 *
 *
 ------->Title: user router
 ->Description: this is router file to handle users information
 ------>Author: Shawon Talukder
 -------->Date: 01/04/2022
 *
 *
 */

// Dependencies
const express = require("express");
const {
  getUsers,
  addUser,
  deleteUser,
} = require("../controllers/userController");
const decorateHTMLResponse = require("../middlewares/common/decorateHTMLresponse");
const avatarUpload = require("../middlewares/users/upload");
const {
  addUserValidator,
  addUserErrorHandler,
} = require("../middlewares/users/dataValidator");
const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");

// Model Scaffolding
const router = express.Router();

// Model Structure

//get all users
router.get(
  "/",
  decorateHTMLResponse("Users"),
  checkLogin,
  requireRole(["admin"]),
  getUsers
);

//add user
router.post(
  "/",
  checkLogin,
  requireRole(["admin"]),
  avatarUpload,
  addUserValidator,
  addUserErrorHandler,
  addUser
);

//delete user
router.delete("/:id", requireRole(["admin"]), deleteUser);

// Export Model
module.exports = router;
