const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/roles.controller");

const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("roles"), controller.index);
router.get("/create", requestMiddleware.getReq("roles"), controller.getCreate);
router.post(
  "/create",
  requestMiddleware.postReq("roles"),
  controller.postCreate
);
router.get("/edit/:id", requestMiddleware.getReq("roles"), controller.getEdit);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("roles"),
  controller.patchEdit
);
router.get(
  "/delete/:id",
  requestMiddleware.getReq("roles"),
  controller.deleteItem
);

module.exports = router;
