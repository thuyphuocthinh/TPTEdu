const express = require("express");
const router = express.Router();
const controller = require("../../controllers/clients/users.controller");
const authMiddleware = require("../../middlewares/clients/auth.middleware");

router.get("/login", controller.getLogin);
router.post("/login", controller.postLogin);
router.get("/register", controller.getRegister);
router.get("/logout", controller.logout);
router.post("/register", controller.postRegister);
router.get("/profile", authMiddleware, controller.getProfile);
router.get("/updatePassword", authMiddleware, controller.getUpdatePassword);

module.exports = router;
