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
  getLogin,
  logInFunc,
  logoutFunc,
} = require("../controllers/loginController");
const {
  loginValidator,
  validationhandler,
} = require("../middlewares/login/loginValidator");
const decorateHTMLResponse = require("../middlewares/common/decorateHTMLresponse");
const { redirectLoggedIn } = require("../middlewares/common/checkLogin");
// Model Scaffolding
const router = express.Router();

// Model Structure
router.get("/", decorateHTMLResponse("Login"), redirectLoggedIn, getLogin);

//post for login
router.post(
  "/",
  decorateHTMLResponse("Login"),
  loginValidator,
  validationhandler,
  logInFunc
);

//logout
router.delete("/", logoutFunc);

// Export Model
module.exports = router;
