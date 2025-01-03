import { register, login,logout } from "../controller/user.js";
import express from "express";
import bodyParaser from "body-parser";

const router = express.Router();

router.use(bodyParaser.urlencoded({ extended: true }))
router.use(express.json());

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
export default router;