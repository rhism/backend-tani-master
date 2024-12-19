const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 
const authenticateToken = require('../middlewares/authMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);

// Update dan ambil foto profil memerlukan autentikasi
router.put('/profile-picture', authenticateToken, authController.upload.single('profile_picture'), authController.updateProfilePicture);
router.get('/profile-picture', authenticateToken, authController.getProfilePicture);




module.exports = router;
