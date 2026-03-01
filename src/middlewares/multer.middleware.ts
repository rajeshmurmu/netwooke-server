import config from "@src/config";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); // keep file in local
  },

  filename: async function (req, file, cb) {
    cb(null, "post-" + crypto.randomUUID().slice(0, 8) + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE!, //
    files: 1,
  },
});
