const express = require("express");
const router = express.Router();
const controller = require("../../controllers/clients/blogs.controller");

router.get("/", controller.index);
router.get("/:slug", controller.getDetailBySlug);

module.exports = router;
