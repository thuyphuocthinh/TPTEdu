const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/courses.controller");
const uploadToCloudinary = require("../../middlewares/admin/uploadCloud");
const multer = require("multer");
const upload = multer();

const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("courses"), controller.index);
router.get("/create", requestMiddleware.getReq("courses"), controller.getCreate);
router.post(
  "/create",
  requestMiddleware.postReq("courses"),
  upload.single("thumbnail"),
  uploadToCloudinary,
  controller.postCreate
);
router.get("/edit/:id", requestMiddleware.getReq, controller.getEdit);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("courses"),
  upload.single("thumbnail"),
  uploadToCloudinary,
  controller.patchEdit
);
router.get("/detail/:id", requestMiddleware.getReq("courses"), controller.getDetail);
router.get("/delete/:id", requestMiddleware.getReq("courses"), controller.deleteItem);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.getReq("courses"),
  controller.updateStatus
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("courses"),
  controller.changeMulti
);

module.exports = router;
