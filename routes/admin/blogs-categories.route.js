const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/blogs-categories.controller");

router.get("/", controller.index);
router.get("/create", controller.getCreate);
router.post("/create", controller.postCreate);
router.get("/edit/:id", controller.getEdit);
router.patch("/edit/:id", controller.patchEdit);
router.get("/updateStatus/:id/:status", controller.updateStatus);
router.get("/delete/:id", controller.deleteItem);
router.patch("/changeMulti", controller.changeMulti);

module.exports = router;
