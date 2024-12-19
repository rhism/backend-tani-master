const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer untuk upload foto profil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_picture'); // Folder untuk menyimpan foto profil
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Membuat nama file unik
    }
});

const upload = multer({ storage });

// Register User
const register = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cek apakah email atau username sudah digunakan
        const [existingUser] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email atau username sudah digunakan' });
        }

        // Tambahkan user ke database
        await pool.query(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        );
        res.status(201).json({ message: 'User berhasil diregistrasi' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Gagal registrasi' });
    }
};

// Login User
const login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        // Cek apakah user ada
        const [user] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [usernameOrEmail, usernameOrEmail]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Password salah' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Login berhasil' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Gagal login' });
    }
};

// Fungsi untuk mencari user berdasarkan email atau username
const findUserByEmailOrUsername = async (email, username) => {
    const query = `SELECT * FROM users WHERE email = ? OR username = ?`;
    const [rows] = await pool.query(query, [email, username]);
    console.log('Query result:', rows);  // Log hasil query untuk debug
    return rows[0];
};

// Update Foto Profil
const updateProfilePicture = async (req, res) => {
    console.log(req.file);
    const userId = req.user.id; // ID user dari middleware
    const profilePicture = req.file ? req.file.filename : null;

    try {
        if (!profilePicture) {
            return res.status(400).json({ message: 'Tidak ada file yang diupload' });
        }

        await pool.query(
            'UPDATE users SET profile_picture = ? WHERE id = ?',
            [profilePicture, userId]
        );
        res.status(200).json({ message: 'Foto profil berhasil diperbarui' });
    } catch (error) {
        console.error('Error during profile picture update:', error);
        res.status(500).json({ message: 'Gagal memperbarui foto profil' });
    }
};

// Mendapatkan Foto Profil
const getProfilePicture = async (req, res) => {
    const userId = req.user.id; // ID user dari middleware
    try {
        const [user] = await pool.query('SELECT profile_picture FROM users WHERE id = ?', [userId]);

        if (user.length > 0 && user[0].profile_picture) {
            const profilePicturePath = path.join(
                __dirname,
                '..',
                'uploads',
                'profile_picture',
                user[0].profile_picture
            );
            res.status(200).sendFile(profilePicturePath);
        } else {
            res.status(404).json({ message: 'Foto profil tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        res.status(500).json({ message: 'Gagal mendapatkan foto profil' });
    }
};

module.exports = {
    register,
    login,
    findUserByEmailOrUsername,
    updateProfilePicture,
    getProfilePicture,

    upload,
};
