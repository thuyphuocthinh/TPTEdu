const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;

// Cloudinary Config
(async function () {
  cloudinary.config({
    cloud_name: "dy0m9udjz",
    api_key: "655763378773479",
    api_secret: "7CheewENHiovwVJtdW4ZJLBNoW8",
  });
})();
// End Cloudinary

let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports.uploadToCloudinary = async (buffer) => {
  let result = await streamUpload(buffer);
  return result.url;
};