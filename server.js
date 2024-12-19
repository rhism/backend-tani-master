const dotenv = require('dotenv'); //harus tetap di atas
dotenv.config(); //harus tetap di atas
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middlewares/authMiddleware');
const { upload } = require('./controllers/authController');
const authController = require('./controllers/authController');
const todoRoutes = require('./routes/todoRoutes');
const ringkasanKeuanganRoutes = require('./routes/ringkasanKeuanganRoutes');
const riwayatKeuanganRoutes = require('./routes/riwayatKeuanganRoutes');
const bahanBibitRoutes = require('./routes/bahanBibitRoutes');
const bahanBakuRoutes = require('./routes/bahanBakuRoutes');
const produksiRoutes = require('./routes/produksiRoutes');
const hasilPanenRoutes = require('./routes/hasilPanenRoutes');
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization", // Header yang diizinkan
  };

  app.use(cors(corsOptions));


  app.use((req, _res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  });

// Middleware untuk parsing JSON request body
app.use(bodyParser.json());

// Routing untuk autentikasi
app.use('/api/auth', authRoutes);
// Routes todo
app.use('/api', todoRoutes);
// Routes ringkasan-keuangan
app.use('/api/', ringkasanKeuanganRoutes);
// Routes riwayat keuangan
app.use('/api', riwayatKeuanganRoutes);
// Routes bahan bibit
app.use('/api', bahanBibitRoutes);
// Routes bahan baku
app.use('/api', bahanBakuRoutes);
// Routes produksi
app.use('/api', produksiRoutes);
// Routes hasil panen
app.use('/api', hasilPanenRoutes);


// Rute untuk meng-upload dan mengambil foto profil
app.post('/upload-profile', authenticateToken, upload.single('profile_picture'), authController.updateProfilePicture);
app.get('/profile-picture', authenticateToken, authController.getProfilePicture);

// Menjalankan server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});