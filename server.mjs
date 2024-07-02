// server.mjs
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.mjs';
import financialRoutes from './routes/financialRoutes.mjs';
import customerRoutes from './routes/customerRoutes.mjs';
import contractRoutes from './routes/contractRoutes.mjs';
import cors from 'cors';
dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; // Use MongoDB URI from environment variables

app.use(express.json());
app.use(cors({
    origin: '*', // Allow requests from this origin
    methods: ['GET', 'POST' , 'PUT' , 'DELETE', 'PATCH'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  }));
  
app.use('/auth', authRoutes);
app.use('/financial', financialRoutes);
app.use('/customer', customerRoutes);
app.use('/contract', contractRoutes);

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
