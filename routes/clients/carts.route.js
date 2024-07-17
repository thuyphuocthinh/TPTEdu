const express = require("express");
const router = express.Router();
const controller = require("../../controllers/clients/carts.controller");

router.get("/", controller.getCart);
router.get("/add/:courseId", controller.addToCart);
router.get("/delete/:courseId", controller.removeFromCart);
router.patch("/updateQuantity", controller.updateQuantity);

module.exports = router;