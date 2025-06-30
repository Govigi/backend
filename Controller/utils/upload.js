const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");

let upload;

const initUpload = () => {
  const storage = new GridFsStorage({
    db: mongoose.connection.db,
    file: (req, file) => {
      return {
        filename: `${Date.now()}-${file.originalname}`,
      };
    },
  });

  upload = multer({ storage });
};

const getUpload = () => {
  if (!upload) {
    throw new Error("Upload middleware not initialized yet.");
  }
  return upload;
};

module.exports = { initUpload, getUpload };
