import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.route.js';

const app = express();


const constOptions = {
    origin: [""],
    credentials: true,
    methods: ["GET", "POST", "PUT"]
}

// Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

// route
app.use('/auth', authRouter)

app.get("/", (req, res) => {
    res.send("Hello, World!")
})

export default app