const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOTPEmail = async (email, otp,type) => {
    try {
        const title = type === 'account_verification'?'verify your account':' event_booking';
        const msg = type === 'account_verification'?
        'Please use the following OTP to verify your account.'
        :'Please use the following OTP to verify and confirm your event booking.';
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: title,
        html:
        `<div style="font-family: Arial, sans-serif;text-align: center;padding: 20px">
        <h2 style="color: #111;">${title}</h2>
        <p style="color: #555;font-size: 16px;">${msg}</p>
        <div style="margin: 20px auto;padding: 10px 20px;background-color: #007BFF;color: #fff;font-size: 24px;display: inline-block;border-radius: 5px;">${otp}</div>
        <p style="color: #999;font-size: 12px;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>`
        
    };
    await transporter.sendMail(mailOptions);
    // console.log(`OTP email sent to ${email} for ${type}`);
    } catch (error) {
        console.error(`Error sending OTP email to ${email} for ${type}:`, error);
    }
};


exports.sendBookingEmail = async(userEmail,userName,eventTitle) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Booking Confirmed: ' + eventTitle,
            html: `
            <h2>HI ${userName},</h2>
            <p>Your booking for the event <strong>${eventTitle}</strong> has been confirmed.</p>
            <p>Thank you for booking with us! We look forward to seeing you at the event.</p>
            <p>Best regards,<br/>Event Management Team</p>
            `
        };
        await transporter.sendMail(mailOptions);
        // console.log(`Booking email sent to ${userEmail} for ${eventTitle}`);
    } catch (error) {
        console.error(`Error sending booking email to ${userEmail} for ${eventTitle}:`, error);
    }
};