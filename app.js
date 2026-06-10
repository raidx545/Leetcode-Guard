const express = require('express');

const app = express();


const userRoutes = require('./routes/userRoutes');

const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);



app.use('/api', authRoutes);


module.exports = app;