const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/errors.controller");

router.get("/notFound", controller.getNotFound);
router.get("/unauthorized", controller.getUnauthorized);

module.exports = router;
