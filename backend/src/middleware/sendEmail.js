import nodemailer from 'nodemailer'
import config from '../config/config.js';

export const sendEmail = async (data) => {
    try {        // Create a transporter using SMTP
        var transport = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        auth: {
                user: config.SMTP_MAIL,
                pass: config.SMTP_PASS,
            }
        });

        const mailOptions = {
            from: config.SMTP_MAIL,
            to: data.email,
            subject: data.subject,
            text: data.message,
            html: data.html || data.message, // HTML body
        }

        await transporter.sendMail(mailOptions)
        return true;
    } catch (error) {
        console.log("Email not send: ", error)
    }
}