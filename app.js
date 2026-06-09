const express = require('express');
const registerRoutes = require('./routes/register');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/register', registerRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});


// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'LeetCode Streak Guard',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            'POST /api/register/initiate': 'Start registration (requires leetcodeUsername, telegramUsername, telegramChatId)',
            'POST /api/register/verify': 'Complete registration (requires leetcodeUsername, telegramChatId, telegramUsername, otpCode)',
            'GET /api/register/status/:username': 'Check registration status',
            'GET /health': 'Health check'
        }
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: [
            '/api/register/initiate (POST)',
            '/api/register/verify (POST)',
            '/api/register/status/:username (GET)',
            '/health (GET)',
            '/ (GET)'
        ]
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;