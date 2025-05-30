const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const {S3Client} = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

const {afterUploadImage, uploadPost} = require('../controllers/post');
const { isLoggedIn } = require("../middlewares"); // middlewares.js 의 isLoggedIn 함수만 불러옴

const router = express.Router();

(async () => {
  try {
    await fs.readdir("uploads");
    console.log("uploads 폴더 확인 완료");
  } catch (err) {
    console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다");
    await fs.mkdir("uploads");
    console.log("uploads 폴더 생성 완료");
  }
})();

const s3 = new S3Client({
  credentials: {
    accessKeyId:process.env.S3_ACCESS_KEY_ID,
    secretAccessKey:process.env.S3_SECRET_ACCESS_KEY,
  },
  region:'ap-southeast-2',
});
// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       cb(null, "uploads/");
//     },
//     filename(req, file, cb) {
//       const ext = path.extname(file.originalname);
//       cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//     },
//   }),
//   limits: { filesize: 5 * 1024 * 1024 },
// });

const upload = multer({
  storage: multerS3({
    s3,
    bucket:'hellomybuckey',
    key(req,file,cb){
      cb(null, `original/${Date.now()}_${file.originalname}`);
    },
  }),
  limits: { filesize: 5 * 1024 * 1024 },
})

//post  post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// post /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

module.exports = router;
