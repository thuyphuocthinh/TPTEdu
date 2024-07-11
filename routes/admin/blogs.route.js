const express = require("express");
const router = express.Router();
const uploadToCloudinary = require("../../middlewares/admin/uploadCloud");
const multer = require("multer");
const upload = multer();
const controller = require("../../controllers/admin/blogs.controller");

router.get("/", controller.index);
router.get("/create", controller.getCreate);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadToCloudinary,
  controller.postCreate
);
router.get("/detail/:id", controller.getDetail);
router.get("/edit/:id", controller.getEdit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadToCloudinary,
  controller.patchEdit
);
router.get("/delete/:id", controller.deleteItem);
router.get("/updateStatus/:id/:status", controller.updateStatus);
router.patch("/changeMulti", controller.changeMulti);

module.exports = router;
