require('dotenv').config()
const uploadOnMemory = require("../config/uploadOnMemory");
const cloudinary = require("../config/cloudinary");
const express = require("express")
const cors = require("cors")
const morgan = require("morgan");
const router = require("./router");
const { MORGAN_FORMAT } = require("../config/application")
const app = express();
console.clear();

app.use(morgan(MORGAN_FORMAT));
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(router)

app.put(
    "/api/profiles/:id/picture/cloudinary",
    uploadOnMemory.single("picture"),
    (req, res) => {
      const fileBase64 = req.file.buffer.toString("base64");
      const file = `data:${req.file.mimetype};base64,${fileBase64}`;
  
      cloudinary.uploader.upload(file, function (err, result) {
        if (!!err) {
          console.log(err);
          return res.status(400).json({
            message: "Gagal upload file!",
          });
        }
  
        res.status(201).json({
          message: "Upload image berhasil",
          url: result.url,
        });
      });
    }
  );

module.exports = app;
