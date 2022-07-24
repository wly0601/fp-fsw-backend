const cloudinary = require("../../../config/cloudinary");

module.exports = {
  uploadPhoto(req, res) {
    if (req.user.id.toString() !== req.params.id.toString()) {
      res.status(401).json({
        status: "Unauthorized",
        message: "User who can upload profile picture is him/herself."
      });
      return;
    }
    const fileBase64 = req.file.buffer.toString("base64");
    const file = `data:${req.file.mimetype};base64,${fileBase64}`;

    cloudinary.uploader.upload(file, function (err, result) {
      if (!!err) {
        return res.status(400).json({
          error: err,
          message: "Gagal upload file!",
        });
      }

      res.status(201).json({
        message: "Upload image berhasil",
        url: result.url,
      });
    });
  },

  uploadProductImages(req, res) {
    if (req.user.id.toString() !== req.params.id.toString()) {
      res.status(401).json({
        status: "Unauthorized",
        message: "User who can upload photo product must be belongs to him/herself."
      });
      return;
    }
    const fileBase64 = req.file.buffer.toString("base64");
    const file = `data:${req.file.mimetype};base64,${fileBase64}`;

    cloudinary.uploader.upload(file, function (err, result) {
      if (!!err) {
        return res.status(400).json({
          error: err,
          message: "Gagal upload file!",
        });
      }

      res.status(201).json({
        message: "Upload photo product berhasil",
        url: result.url,
      });
    });
  }
};