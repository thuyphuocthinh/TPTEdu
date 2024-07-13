const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");
// middleware
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq, controller.index);
router.get("/create", requestMiddleware.getReq, controller.getCreate);
router.post("/create", requestMiddleware.postReq, controller.postCreate);
router.get("/edit/:id", requestMiddleware.getReq, controller.getEdit);
router.patch("/edit/:id", requestMiddleware.patchReq, controller.patchEdit);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.getReq,
  controller.updateStatus
);
router.get("/delete/:id", requestMiddleware.getReq, controller.deleteItem);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq,
  controller.changeMulti
);

module.exports = router;
