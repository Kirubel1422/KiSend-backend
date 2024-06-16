const mongoose = require("mongoose");
const { DB_NAME } = process.env;

mongoose.Promise = global.Promise;

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`);
    console.log("DB connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
