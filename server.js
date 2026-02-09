const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
// Assumes your files are organized in a 'src' folder structure as implied by your relative imports (e.g., ../controllers)
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Crucial for allowing requests from your React frontend
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.send('Smart Inventory API is running');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});