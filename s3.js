require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const imagePath = "image.png";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKey,
  secretKey,
});

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}

function getFileStream(fileKey) {
  const downloadParams = { Key: fileKey, Bucket: bucketName };
  const result = s3.getObject(downloadParams).createReadStream();
  return result;
}

async function getImage(fileKey) {
  let a = false;
  const params = { Key: fileKey, Bucket: bucketName };
  await s3.getObject(params, function (err, data) {
    if (err) {
      console.error(err.code, "-", err.message);
      return callback(err);
    }
    fs.writeFile(imagePath, data.Body, (er) => callback());
    a = true;
  });
  return a;
}

function callback(err) {
  if (err) console.log(err);
}

module.exports = { uploadFile, getFileStream, getImage };
