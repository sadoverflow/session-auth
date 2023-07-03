import express from "express";
import { login, signup, logout } from "../controllers/authController.js";
import { check } from "express-validator";
import { loginLimiter } from "../../rate-limiter.js";

const router = express.Router();

router.post(
    "/login",
    loginLimiter,
    check("email").notEmpty().withMessage("Please enter email"),
    check("password").notEmpty().withMessage("Please enter password"),
    login
);
router.post(
    "/signup",
    check("email")
        .notEmpty()
        .withMessage("Please enter email")
        .isEmail()
        .withMessage("Please enter valid email address"),
    check("password")
        .notEmpty()
        .withMessage("Please enter password")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters"),
    signup
);
router.post("/logout", logout);

export default router;
