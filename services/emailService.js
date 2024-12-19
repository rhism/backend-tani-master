// emailService.js
const nodemailer = require('nodemailer');

// Konfigurasi transport email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Atau layanan lain
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fungsi kirim email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email terkirim');
  } catch (error) {
    console.error('Gagal mengirim email:', error);
  }
};

module.exports = { sendEmail };
