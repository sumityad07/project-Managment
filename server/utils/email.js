const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const sendEmailViaAPI = async (toEmail, subject, htmlContent) => {
    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'Eventora',
                    email: process.env.EMAIL_USER // sy171676@gmail.com
                },
                to: [{ email: toEmail }],
                subject: subject,
                htmlContent: htmlContent
            },
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            }
        );

        console.log('✅ Email sent successfully to', toEmail);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ Error sending email via API:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    const html = `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventora.</p>
    `;
    return sendEmailViaAPI(userEmail, `Booking Confirmed: ${eventTitle}`, html);
};

const sendOTPEmail = async (userEmail, otp, type) => {
    const isAccountVerification = type === 'account_verification';
    const title = isAccountVerification ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
    const msg = isAccountVerification
        ? 'Please use the following OTP to verify your new Eventora account.'
        : 'Please use the following OTP to verify and confirm your event booking.';

    const html = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #111;">${title}</h2>
            <p style="color: #555; font-size: 16px;">${msg}</p>
            <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px; border-radius: 6px;">
                ${otp}
            </div>
            <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
        </div>
    `;
    return sendEmailViaAPI(userEmail, title, html);
};

module.exports = { sendBookingEmail, sendOTPEmail };