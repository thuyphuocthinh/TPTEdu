const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/courses-categories.controller");
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("courses"), controller.index);
router.get(
  "/create",
  requestMiddleware.getReq("courses"),
  controller.getCreate
);
router.post(
  "/create",
  requestMiddleware.postReq("courses"),
  controller.postCreate
);
router.get(
  "/edit/:id",
  requestMiddleware.getReq("courses"),
  controller.getEdit
);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("courses"),
  controller.patchEdit
);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.getReq("courses"),
  controller.updateStatus
);
router.get(
  "/delete/:id",
  requestMiddleware.getReq("courses"),
  controller.deleteItem
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("courses"),
  controller.changeMulti
);

module.exports = router;
