import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            password: hashPassword,
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect User",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }

        const token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            })
            .json({
                success: true,
                message: `${user.fullname} logged in successfully`,
            });
    } catch (e) {
        console.error("Login Error:", e);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", "", { maxAge: 0 })
            .json({
                success: true,
                message: "Logged out successfully",
            });
    } catch (e) {
        console.error("Logout Error:", e);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
