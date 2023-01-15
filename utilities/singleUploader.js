/*
 *
 *
 ------->Title: single file uploader 
 ->Description: this file is to handle single file uploading using multer.
 ------>Author: Shawon Talukder
 -------->Date: 01/05/2023
 *
 *
 */

// Dependencies
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

// Model Structure
const singleUploader = (subfolderName, allowedMimetypes, filesize, errMsg) => {
  //upload object
  const uploadFolder = `${__dirname}/../public/uploads/${subfolderName}`;

  //storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, filename + fileExt);
    },
  });

  //final upload object
  const upload = multer({
    storage: storage,
    limits: {
      filesize: filesize,
    },
    fileFilter: (req, file, cb) => {
      if (allowedMimetypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(errMsg));
      }
    },
  });

  return upload;
};
// Export Model
module.exports = singleUploader;
