import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
        }, 
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true,
        }, 
        password: {
            type: String,
            trim: true,
            required: true, 
            min: [6, 'Password length must be 6 characters']
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifyEmailOtp: {
            type: String,
        },
        verifyEmailOtpExpire: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpire: {
            type: Date,
        },
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User