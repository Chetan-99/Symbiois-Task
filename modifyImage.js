const watermark = require("jimp-watermark");
const { getImage } = require("./s3");
const imagePath = "image.png";
const newImagePath = "newImage.png";
const options = {
  text: "Symbionic",
  textSize: 8,
  dstPath: newImagePath,
};

const modifyImage = async (key) =>
  new Promise((resolve, reject) => {
    let result = false;
    function image() {
      result = getImage(key);
    }
    function textImage() {
      watermark.addTextWatermark(imagePath, options);
      setTimeout(() => {
        resolve(true);
      }, 500);
    }
    image();
    setTimeout(() => {
      if (result) {
        textImage();
      } else reject(false);
    }, 500);
  });

module.exports = modifyImage;
