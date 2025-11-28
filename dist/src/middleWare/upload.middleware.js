"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3_1 = require("../config/s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3_1.s3,
        bucket: process.env.AWS_S3_BUCKET,
        key: function (req, file, cb) {
            const fileName = `rooms/${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
});
