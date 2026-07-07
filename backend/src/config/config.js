import dotenv from 'dotenv'
dotenv.config()


const config = {
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_MAIL: process.env.SMTP_MAIL,
    SMTP_PASS: process.env.SMTP_PASS,
}

export default  config