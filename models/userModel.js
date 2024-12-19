const pool = require('../config/db');

// Fungsi untuk menambahkan pengguna baru
const createUser = async (email, username, password) => {
    const [result] = await pool.execute(
        'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
        [email, username, password]
    );
    return result.insertId; // Mengembalikan ID pengguna baru
};

// Fungsi untuk menemukan pengguna berdasarkan email atau username
const findUserByEmailOrUsername = async (identifier) => {
    const [rows] = await pool.execute(
        'SELECT id, email, username, password FROM users WHERE email = ? OR username = ?',
        [identifier, identifier]
    );
    return rows[0]; // Mengembalikan baris pertama (user yang ditemukan)
};

module.exports = { createUser, findUserByEmailOrUsername };