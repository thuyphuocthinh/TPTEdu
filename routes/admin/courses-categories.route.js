const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/courses-categories.controller");

router.get("/", controller.index);
router.get("/create", controller.getCreate);
router.post("/create", controller.postCreate);
router.post("/edit/:id", controller.getEdit);
router.patch("/edit/:id", controller.patchEdit);
router.patch("/detail/:id", controller.getDetail);

module.exports = router;
