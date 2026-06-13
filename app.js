const express = require('express');

const app = express();


const userRoutes = require('./routes/userRoutes');

const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);



app.use('/api', authRoutes);


app.get("/", (req, res) => {
    res.send("LeetCode Guard API is running!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        time: new Date()
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

module.exports = app;