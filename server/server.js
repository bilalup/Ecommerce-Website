import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import Parse from 'parse/node';

dotenv.config();

const app = express();




app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.json()); // Parse JSON bodies (replaces body-parser)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

Parse.initialize("hXrWWSkGijWY0SNrPloF8wOBmcEUo8I2xbmLsJvl", "Ja7RzIGxGgNsP84m9A1r4LEcqKDnTcWBwiaI2o29", "pIUCz1imhwxWUv3xIKJY4HKldAP6ZgT2hEGs2AhB");
Parse.serverURL = "https://parseapi.back4app.com/";

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));