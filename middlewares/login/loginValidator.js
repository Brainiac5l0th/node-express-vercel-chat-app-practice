/*
 *
 *
 ------->Title: log in form validation
 ->Description: this file is to validate form information provided by the user
 ------>Author: Shawon Talukder
 -------->Date: 01/07/2023
 *
 *
 */

//dependencies
const { check, validationResult } = require("express-validator");

//model scaffolding
const loginValidator = [
  check("username")
    .isLength({ min: 1 })
    .withMessage("mobile or email required!"),
  check("password").isLength({ min: 1 }).withMessage("password required!"),
];

const validationhandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: mappedErrors,
    });
  }
};

module.exports = {
  loginValidator,
  validationhandler,
};
