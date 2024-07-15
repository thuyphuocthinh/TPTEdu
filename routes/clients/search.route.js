const express = require("express");
const router = express.Router();
const controller = require("../../controllers/clients/courses.controller");

router.get("/", controller.search);

module.exports = router;
