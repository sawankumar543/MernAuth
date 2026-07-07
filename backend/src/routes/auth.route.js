import { Router } from "express";
import { getAllUsers, login, logout, register, userProfile } from "../controllers/auth.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get("/profile", authMiddleware,userProfile)
authRouter.get("/users", getAllUsers)

export default authRouter