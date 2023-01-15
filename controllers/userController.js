/*
 *
 *
 ------->Title: users controller
 ->Description: this controller is to handle all users related data
 ------>Author: Shawon Talukder
 -------->Date: 01/05/2023
 *
 *
 */
//dependencies
const bcrypt = require("bcrypt");
const User = require("../model/People");
const { unlink } = require("fs");
const path = require("path");

//to render login page
const getUsers = async (req, res, next) => {
  const users = await User.find();

  try {
    res.render("users", {
      users: users,
    });
  } catch (err) {
    next(err);
  }
};

//add user data into the database
const addUser = async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  let newUser;
  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
      avatar: req.files[0].filename,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }
  //save user to database
  try {
    const result = await newUser.save();
    res.status(200).json({ message: "User was added successfully!" });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
};

//delete user
const deleteUser = async (req, res, next) => {
  try {
    const targetedUser = await User.findByIdAndDelete({ _id: req.params.id });

    //remove avatar if there is any
    if (targetedUser.avatar) {
      unlink(
        path.join(
          __dirname,
          `../public/uploads/avatars/${targetedUser.avatar}`
        ),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    res.status(200).json({ message: "User removed successfully!" });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
};
module.exports = {
  getUsers,
  addUser,
  deleteUser,
};
