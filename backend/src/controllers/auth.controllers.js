import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import config from "../config/config.js";
dotenv.config()
import bcrypt from 'bcryptjs'
import sendEmail from "../middleware/sendEmail.js";
import crypto from 'crypto'

const NODE_ENV = config.NODE_ENV;
const OTP_EXPIRES_MINUTES = 15;

export const register = async (req, res) => {
    const { username, email, password } = req.body;    
    try {
        if (!username || !email || !password) {
            return res.status(422).json({
                success: false,
                message: "All fields are required!"
            });
        }
        // Check if user exists or not
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "User Already Exists!"
            });
        }   
        // Hash password
        const hashPass = await bcrypt.hash(password, 10);

        // const otp = Math.floor(100000 + Math.random() * 900000)
        const otp = crypto.randomBytes(100000, 999999).toString();
        const verifyEmailOtpExpire = Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000

        const user = new User({
            username,
            email,
            password: hashPass,
            verifyEmailOtp: otp,
            verifyEmailOtpExpire,
        });

        await user.save();

        const payload = {
            username: user.username,
            email: user.email
        };
        const data = {};
        sendEmail(data)
        return res.status(201).json({
            success: true,
            message: "Registered successfully", // Fixed typo "white registering" -> "while registering"
            user: payload,
        });

    } catch (error) {
        console.error("Registration Error: ", error); // Good practice to log the actual error for debugging
        return res.status(500).json({
            success: false,
            message: "Server error while registering" 
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(422).json({
                success: false,
                message: "All fields are required!"
            });
        }

        // Check if user exists or not
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials" // Security tip: Do not expose if email exists or not
            });
        }

        // Check password
        const isPasswordRight = await bcrypt.compare(password, userExists.password);
        if (!isPasswordRight) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // FIX 1: Used userExists._id instead of user?._id
        const token = jwt.sign({ _id: userExists._id }, config.JWT_SECRET, {
            expiresIn: '7d'
        });

        // FIX 2: Added process.env.NODE_ENV to avoid reference errors
        const isProduction = config.NODE_ENV === "production";
        const options = {
            httpOnly: true,
            secure: isProduction,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: isProduction ? "none" : "lax",
        };

        // FIX 3: Defined payload matching your registration style (excluding ID)
        const payload = {
            username: userExists.username,
            email: userExists.email
        };

        // FIX 4: Returned the response correctly
        return res.status(200).cookie('token', token, options).json({
            success: true,
            message: "Logged in successfully",
            person: payload
        });

    } catch (error) {
        console.error("Login Error: ", error); // Debugging ke liye track karein
        return res.status(500).json({
            success: false,
            message: "Server error while logging in" // Typo fixed
        });
    }
};


export const logout = (req, res) => {
    try {
        const options =  {
            httpOnly: true,
            secure: NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: NODE_ENV === "production" ? "none": "lax",
        }
        res.status(200).clearCookie('token', options).json({
            success: true,
            message: "Logout successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while logout"
        })
    }
}

export const userProfile = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).select('-password -_id')
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User Profile not found!"
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while logout"
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if(!users){
            return res.status(404).json({
                success: false,
                message: "Users not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Users found successfully",
            users,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while getting users!"
        })
    }
}