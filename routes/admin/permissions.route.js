const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/permissions.controller");
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("permissions"), controller.index);
router.patch(
  "/edit",
  requestMiddleware.patchReq("permissions"),
  controller.patchEdit
);

module.exports = router;
