/*
 *
 *
 ------->Title: 
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: MM/DD/2023
 *
 *
 */
const uploader = require("../../utilities/multipleUploader");

function attachmentUpload(req, res, next) {
  const upload = uploader(
    "attachments",
    ["image/png", "image/jpg", "image/jpeg"],
    1000000,
    2,
    "only .jpg, .jpeg, .png format allowed!and maximum size: 1mb, maximum file: 2"
  );

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}
module.exports = attachmentUpload;
