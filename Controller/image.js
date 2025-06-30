const { getGFS } = require("./utils/gridfs");

const getImageByFilename = async (req, res) => {
  try {
    const gfs = getGFS();
    if (!gfs) {
      return res.status(500).json({ message: "GridFS not initialized" });
    }

    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file || !file.contentType.startsWith("image")) {
      return res.status(404).json({ message: "Image not found or not an image" });
    }

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } 
  catch (err) {
    res.status(500).json({ message: "Error fetching image", error: err.message });
  }
};

module.exports = {
  getImageByFilename,
};
