const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/courses.controller");
const uploadToCloudinary = require("../../middlewares/admin/uploadCloud");
const multer = require("multer");
const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.getCreate);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadToCloudinary,
  controller.postCreate
);
router.get("/edit/:id", controller.getEdit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadToCloudinary,
  controller.patchEdit
);
router.get("/detail/:id", controller.getDetail);
router.get("/delete/:id", controller.deleteItem);
router.get("/updateStatus/:id/:status", controller.updateStatus);
router.patch("/changeMulti", controller.changeMulti);

module.exports = router;
