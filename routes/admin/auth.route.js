const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");

router.get("/login", controller.getLogin);
router.get("/logout", controller.logout);
router.post("/login", controller.postLogin);

module.exports = router;
