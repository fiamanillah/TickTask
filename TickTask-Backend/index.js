const express = require('express');
const { createServer } = require('http');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/mongodb');
const userRoutes = require('./routes/userRoutes');
const initializeSocket = require('./config/socket'); // Import socket module

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Middleware to pass Socket.IO instance to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});
const allowedOrigins = [
    'https://parcelpop-project.web.app', // Production frontend
    'http://localhost:5173', // Development frontend
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', require('./routes/taskRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = httpServer;
