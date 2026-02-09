const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
// Assumes your files are organized in a 'src' folder structure as implied by your relative imports (e.g., ../controllers)
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const setupDb = require('./setup_db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  // Allow all origins for now to ensure Vercel frontend can connect
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.send('Smart Inventory API is running');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', analyticsRoutes);

setupDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});