const express = require('express');
const cors = require("cors");
const app = express();


const userRoutes = require('./routes/userRoutes');

const authRoutes = require('./routes/authRoutes');


const jobRoutes = require("./routes/jobRoutes");



/*
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://your-frontend.vercel.app"
        ]
    })
);
*/

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use("/api/jobs", jobRoutes);



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