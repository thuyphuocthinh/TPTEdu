const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/statistics.controller");
const requestMiddleware = require("../../middlewares/admin/requestMiddleware");

router.get("/", requestMiddleware.getReq("statistics"), controller.index);

module.exports = router;
