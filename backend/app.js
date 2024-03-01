const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL)
.then((conn,err) => {
  if(conn){
    console.log("MongoDB connected")
  }
  else{
    console.log("Could not connect to the database");
  }
})
mongoose.Promise = global.Promise;
const adminroute = require("./routes/admin");
const organizationroute = require("./routes/organisation");
const verifyroute = require("./routes/verification");
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
app.use("/admin", adminroute);
app.use("/organization", organizationroute);
app.use("/verify", verifyroute);
app.get("/image_files/:filename", (req, res) => {
  const filename = req.params.filename.replace(".docx", ".jpg");
  console.log(filename);
  const imagePath = path.join(__dirname, "image_files", filename);
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).json({ error: "File not found" });
    }
  });
});
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
