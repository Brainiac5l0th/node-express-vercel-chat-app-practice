/*
 *
 *
 ------->Title: login controller
 ->Description: this controller is to handle all login related data
 ------>Author: Shawon Talukder
 -------->Date: 01/04/2023
 *
 *
 */
//dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../model/People");

//to render login page
const getLogin = (req, res, next) => {
  res.render("index");
};

//login functionality
const logInFunc = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [{ mobile: req.body.username }, { email: req.body.username }],
    });
    if (user && user._id) {
      const isValidPass = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isValidPass) {
        const userObject = {
          userid: user._id,
          username: user.name,
          email: user.email,
          avatar: user.avatar || null,
          role: user.role || "user",
        };

        //generate token
        const token = await jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.EXPIRY,
        });

        //set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.EXPIRY,
          httpOnly: true,
          signed: true,
        });

        //set user object into local variable
        res.locals.loggedInUser = userObject;
        res.redirect("inbox");
      } else {
        throw createError("Login Failed! Please try again.");
      }
    } else {
      throw createError("Login Failed! Please try again.");
    }
  } catch (err) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

//logout func
const logoutFunc = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("Logged out!");
};
// export
module.exports = {
  getLogin,
  logInFunc,
  logoutFunc,
};
