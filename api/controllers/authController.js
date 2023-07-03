import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";

export const signup = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMsg = errors.array()[0].msg;
            return res.status(400).json({ error: errorMsg, status: 400 });
        }
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res
                .status(400)
                .json({ error: "user already exist", status: 400 });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            password: passwordHash,
        });

        await newUser.save();
        res.status(200).json({ message: "user created", status: 200 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array(), status: 400 });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(401)
                .json({ error: "Invalid credentials", status: 401 });
        }

        const { email: userEmail, id: userId } = user;
        req.session.user = { email: userEmail, id: userId };

        res.status(200).json({ message: "user logged in", status: 200 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.clearCookie("qid");
        res.status(200).json({ message: "user logged out", status: 200 });
    });
};
