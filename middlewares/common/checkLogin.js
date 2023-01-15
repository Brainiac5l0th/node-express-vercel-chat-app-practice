/*
 *
 *
 ------->Title: authentication file
 ->Description: this file is to authenticate if a user is logged in or not
 ------>Author: Shawon Talukder
 -------->Date: 01/07/2023
 *
 *
 */

//dependencies
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

//model scaffolding
const checkLogin = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      token = cookies[process.env.COOKIE_NAME];
      //verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      //pass user information to response as local variable
      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (err) {
      if (res.locals.html) {
        res.redirect("/");
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: "Authentication Failure!",
            },
          },
        });
      }
    }
  } else {
    if (res.locals.html) {
      res.redirect("/");
    } else {
      res.status(500).json({
        errors: {
          common: {
            msg: "Authentication Failure!",
          },
        },
      });
    }
  }
};

//redirect to inbox if have cookie yet
const redirectLoggedIn = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    //redirect to inbox page
    res.redirect("/inbox");
  } else {
    next();
  }
};

//authorization
const requireRole = (role) => {
  return function (req, res, next) {
    if (req.user.role && role.includes(req.user.role)) {
      next();
    } else {
      if (res.locals.html) {
        next(createError(401, "You are not authorized for this page!"));
      } else {
        res.status(401).json({
          errors: {
            common: {
              msg: "You are not authorized!",
            },
          },
        });
      }
    }
  };
};

//export the module
module.exports = {
  checkLogin,
  redirectLoggedIn,
  requireRole,
};
