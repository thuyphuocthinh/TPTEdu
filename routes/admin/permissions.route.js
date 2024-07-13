const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/permissions.controller");

router.get("/", controller.index);
router.patch("/edit", controller.patchEdit);

module.exports = router;
