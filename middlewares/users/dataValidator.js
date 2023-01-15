/*
 *
 *
 ------->Title: validate data
 ->Description: this file is to validate data provided by admin
 ------>Author: Shawon Talukder
 -------->Date: 01/06/2022
 *
 *
 */

//dependencies
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const { unlink } = require("fs");
const path = require("path");

//user model from database
const User = require("../../model/People");

//model scaffolding
const addUserValidator = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required!")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything othen than alphabet!")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Enter valid e-mail adress!")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already is in use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", { strictMode: true })
    .withMessage(
      "Mobile must be a valid Bangladeshi mobile Number! Including +880 "
    )
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile already is in use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol!"
    ),
];

const addUserErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    //remove uploaded avatar files
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    //response the errors
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  addUserValidator,
  addUserErrorHandler,
};
