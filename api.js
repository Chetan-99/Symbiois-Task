const express = require("express");
const api = express.Router();
const multer = require("multer");
const upload = multer({ dest: "../uploads/" });
const fs = require("fs");
const util = require("util");
const unLinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require("./s3");
const modifyImage = require("./modifyImage");
const newImage = "newImage.png";
const image = "image.png";

api.get("/:key", async (req, res) => {
  const key = req.params.key;
  modifyImage(key)
    .then(() => {
      const fileStream = fs.createReadStream(newImage);
      unLinkFile(newImage);
      unLinkFile(image);
      fileStream.pipe(res);
    })
    .catch(() => {
      res.status(500).send("Unexpected error occurred");
    });
});

api.get("/original/:key", async (req, res) => {
  const key = req.params.key;
  const fileStream = getFileStream(key);
  fileStream.pipe(res);
});

api.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  await unLinkFile(file.path);
  res.send({ imagePath: `/images/${result.Key}` });
});

module.exports = api;
