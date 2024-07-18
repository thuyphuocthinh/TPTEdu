const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/orders.controller");
// middleware
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("orders"), controller.index);
router.get(
  "/changeStatus/:id/:status",
  requestMiddleware.getReq("orders"),
  controller.updateStatus
);
router.get(
  "/detail/:orderId",
  requestMiddleware.getReq("orders"),
  controller.getDetail
);

module.exports = router;
