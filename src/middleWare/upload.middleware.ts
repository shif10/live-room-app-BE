import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/s3";
import dotenv from "dotenv";
dotenv.config();  

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: function (req, file, cb) {
      const fileName = `rooms/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});
