const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");
// middleware
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("accounts"), controller.index);
router.get("/create", requestMiddleware.getReq("accounts"), controller.getCreate);
router.post("/create", requestMiddleware.postReq("accounts"), controller.postCreate);
router.get("/edit/:id", requestMiddleware.getReq("accounts"), controller.getEdit);
router.patch("/edit/:id", requestMiddleware.patchReq("accounts"), controller.patchEdit);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.getReq("accounts"),
  controller.updateStatus
);
router.get("/delete/:id", requestMiddleware.getReq("accounts"), controller.deleteItem);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("accounts"),
  controller.changeMulti
);

module.exports = router;
