require('dotenv').config()
const uploadOnMemory = require("../config/uploadOnMemory");
const cloudinary = require("../config/cloudinary");
const express = require("express")
const cors = require("cors")
const morgan = require("morgan");
const router = require("./router");
const controllers = require("./controllers");
const { MORGAN_FORMAT } = require("../config/application")
const app = express();
console.clear();

const nodeEnv = process.env.NODE_ENV;
if(!nodeEnv || nodeEnv === "production"){
  app.use(morgan(MORGAN_FORMAT));
}

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(router)

app.put(
    "/api/user/picture/:id/cloudinary",
    controllers.api.authentication.authorize,
    uploadOnMemory.single("picture"),
    (req, res) => {
      if (req.user.id.toString() !== req.params.id.toString()){
        res.status(401).json({
          status: "Unauthorized",
          message: "User who can upload profile picture is him/herself."
        })
        return
      }
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
