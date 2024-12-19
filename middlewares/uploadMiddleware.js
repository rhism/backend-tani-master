const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_picture'); // Folder tempat menyimpan file
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filter file hanya menerima gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images (JPEG, JPG, PNG) are allowed'));
    }
};

// Middleware untuk upload
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Maksimum 2MB
    fileFilter
});

module.exports = upload;