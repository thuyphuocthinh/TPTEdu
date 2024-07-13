const express = require("express");
const router = express.Router();
const uploadToCloudinary = require("../../middlewares/admin/uploadCloud");
const multer = require("multer");
const upload = multer();
const controller = require("../../controllers/admin/blogs.controller");
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("blogs"), controller.index);
router.get("/create", requestMiddleware.getReq("blogs"), controller.getCreate);
router.post(
  "/create",
  requestMiddleware.postReq("blogs"),
  upload.single("thumbnail"),
  uploadToCloudinary,
  controller.postCreate
);
router.get(
  "/detail/:id",
  requestMiddleware.getReq("blogs"),
  controller.getDetail
);
router.get("/edit/:id", requestMiddleware.getReq("blogs"), controller.getEdit);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("blogs"),
  upload.single("thumbnail"),
  uploadToCloudinary,
  controller.patchEdit
);
router.get(
  "/delete/:id",
  requestMiddleware.getReq("blogs"),
  controller.deleteItem
);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.getReq("blogs"),
  controller.updateStatus
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("blogs"),
  controller.changeMulti
);

module.exports = router;
