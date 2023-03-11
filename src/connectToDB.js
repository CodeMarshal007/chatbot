const mongoose = require("mongoose");
const CONFIG = require("./config");

function connectToDB() {
  mongoose.connect(CONFIG.LOCAL_MONGODB_URI, {
    useNewUrlParser: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected to Local MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}

module.exports = connectToDB;
