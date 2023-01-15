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

const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
function uploader(
  subfolderName,
  allowedMimetypes,
  maxFilesize,
  totalFiles,
  errorMsg
) {
  //define the path to save
  const UPLOAD_FOLDER = path.join(
    __dirname,
    `../public/uploads/${subfolderName}`
  );

  //define a storage object
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  //prepare final object to upload
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: maxFilesize,
    },
    fileFilter: (req, file, cb) => {
      if (req.files.length > totalFiles) {
        cb(createError(errorMsg));
      } else {
        if (allowedMimetypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(createError(errorMsg));
        }
      }
    },
  });
  return upload;
  
}

module.exports = uploader;
