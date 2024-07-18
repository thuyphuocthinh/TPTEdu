const express = require("express");
const router = express.Router();
const controller = require("../../controllers/clients/checkout.controller");

router.get("/", controller.index);
router.post("/", controller.order);

module.exports = router;
