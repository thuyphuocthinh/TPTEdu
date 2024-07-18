const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller");
// middleware
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("users"), controller.index);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.getReq("users"),
  controller.updateStatus
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("users"),
  controller.changeMulti
);

module.exports = router;
