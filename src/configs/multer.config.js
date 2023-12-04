const multer = require("multer");
const path = require("path");

const userPath = (userId) => {
  return `/user/user${userId}`;
};

const commicPath = (commicId) => {
  return `/commic/user${commicId}`;
};

const assetPath = () => {
  return `/image`;
};

const uploadDiskUser = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const id = req.params.id;
      const destPath = path.join(__dirname, "..", "public", userPath(id));
      cb(null, destPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  }),
});

module.exports = {
  uploadDiskUser,
};
