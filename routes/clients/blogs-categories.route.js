const express = require("express");
const router = express.Router();
const controller = require("../../controllers/clients/blogs-categories.controller");

router.get("/", controller.index);
router.get("/:slug", controller.getBySlug);

module.exports = router;