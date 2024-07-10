const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to database successfully");
  } catch (error) {
    console.log("Error connect to database: ", error);
  }
};
