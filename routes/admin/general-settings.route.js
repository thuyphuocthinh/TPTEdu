const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/general-settings.controller");
const uploadToCloudinary = require("../../middlewares/admin/uploadCloud");
const multer = require("multer");
const upload = multer();

const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get(
  "/edit",
  requestMiddleware.getReq("settings"),
  controller.getEdit
);
router.patch(
  "/edit",
  requestMiddleware.patchReq("settings"),
  upload.single("logo"),   
  uploadToCloudinary,
  controller.patchEdit
);

module.exports = router;
