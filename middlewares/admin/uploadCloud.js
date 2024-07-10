const { uploadToCloudinary } = require("../../helpers/uploadCloudinary");

module.exports = async (req, res, next) => {
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    req.body[req.file.fieldname] = result;
  }
  next();
};
