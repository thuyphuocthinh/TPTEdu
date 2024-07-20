const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/interfaces.controller");
const uploadToCloudinary = require("../../middlewares/admin/uploadCloud");
const multer = require("multer");
const upload = multer();
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get(
  "/carousels",
  requestMiddleware.getReq("interfaces/carousels"),
  controller.getCarousels
);
router.get(
  "/carousels/create",
  requestMiddleware.getReq("interfaces/carousels"),
  controller.getCreateCarousels
);
router.post(
  "/carousels/create",
  requestMiddleware.postReq("interfaces/carousels"),
  upload.single("image"),
  uploadToCloudinary,
  controller.postCreateCarousels
);
router.get(
  "/carousels/:id",
  requestMiddleware.getReq("interfaces/carousels"),
  controller.deleteCarousel
);

router.get(
  "/carousels/delete/:id",
  requestMiddleware.deleteReq("interfaces/carousels"),
  controller.deleteCarousel
);

module.exports = router;
