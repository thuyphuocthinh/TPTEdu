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
router.patch("/profile", authMiddleware, controller.patchUpdateProfile);
router.get("/updatePassword", authMiddleware, controller.getUpdatePassword);
router.patch("/updatePassword", authMiddleware, controller.patchUpdatePassword);
router.get("/orders", controller.getOrders);
router.get("/orders/:orderId", controller.getOrderDetail);
router.get("/forgotPassword", controller.getForgotPassword);
router.post("/forgotPassword", controller.postForgotPassword);
router.post("/otp", controller.postOtp);
router.patch("/resetPassword", controller.patchResetPassword);

module.exports = router;
