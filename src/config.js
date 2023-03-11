require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  LOCAL_MONGODB_URI: process.env.LOCAL_MONGODB_URI,
};
