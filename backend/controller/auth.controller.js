import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check for missing fields
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, statusCode: 400, message: "All fields are required" });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error('Signup error:', error);
        // Duplicate key error (username or email already exists)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ success: false, statusCode: 409, message: `${field} already exists` });
        }
        next(errorHandler(500, error.message || "Internal server error"));
    }
}



export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ success: false, statusCode: 400, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, statusCode: 404, message: "User not found" });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('access_token', token, { httpOnly: true,}).status(200).json(user)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, statusCode: 401, message: "Invalid password" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error('Signin error:', error);
        next(errorHandler(500, error.message || "Internal server error"));
    };
};


export const google = async (req, res, next) => {
    try {
       const user =  await User.findOne({ email: req.body.email });
       if(user){
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { password, ...rest } = user._doc;
        res.cookie('access_token', token, { httpOnly: true,}).status(200).json(rest);
       } else {
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
        const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { password, ...rest } = newUser._doc;
        res.cookie('access_token', token, { httpOnly: true,}).status(200).json(rest);
       }
    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}