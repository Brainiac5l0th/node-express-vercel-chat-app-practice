/*
 *
 *
 ------->Title: upload middleware
 ->Description: this middleware is to handle file upload
 ------>Author: Shawon Talukder
 -------->Date: 01/05/2023
 *
 *
 */
const uploader = require("../../utilities/singleUploader");
const avatarUpload = (req, res, next) => {
  const upload = uploader(
    "avatars",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpg .jpeg .png format allowed! or max size 1mb"
  );

  //call the middleware here to handle error from multer.
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
};

module.exports = avatarUpload;
