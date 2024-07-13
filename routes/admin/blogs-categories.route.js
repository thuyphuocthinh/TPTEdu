const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/blogs-categories.controller");
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("blogs-categories"), controller.index);
router.get("/create", requestMiddleware.getReq("blogs-categories"), controller.getCreate);
router.post(
  "/create",
  requestMiddleware.postReq("blogs-categories"),
  controller.postCreate
);
router.get("/edit/:id", requestMiddleware.getReq("blogs-categories"), controller.getEdit);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("blogs-categories"),
  controller.patchEdit
);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.getReq("blogs-categories"),
  controller.updateStatus
);
router.get(
  "/delete/:id",
  requestMiddleware.getReq("blogs-categories"),
  controller.deleteItem
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("blogs-categories"),
  controller.changeMulti
);

module.exports = router;
