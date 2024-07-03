// server.mjs
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.mjs';
import financialRoutes from './routes/financialRoutes.mjs';
import customerRoutes from './routes/customerRoutes.mjs';
import contractRoutes from './routes/contractRoutes.mjs';
import taskRoutes from './routes/taskRoutes.mjs';

import cors from 'cors';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; // Use MongoDB URI from environment variables

// Middleware
const allowedOrigins = ['http://localhost:3000', 'https://todowebappcrud.netlify.app'];

// CORS options function
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
    // Allow request from an origin in allowedOrigins array
    corsOptions = { origin: true, credentials: true };
  } else {
    // Block request if not from an allowed origin
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

// Middleware
app.use(express.json());
app.use(cors(corsOptionsDelegate));

// Routes
app.get('/api', (req, res) => {
  res.send('Hello World from Vercel!');
});

// Mounting routes
app.use('/auth', authRoutes);
app.use('/financial', financialRoutes);
app.use('/customer', customerRoutes);
app.use('/contract', contractRoutes);
app.use('/task', taskRoutes);

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});
