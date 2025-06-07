require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Serve static files (your HTML, CSS, JS files)
app.use(express.static(path.join(__dirname, '.')));

// API endpoint to get the API key
app.get('/api/config', (req, res) => {
    console.log('Config endpoint called');
    
    if (!process.env.API_KEY) {
        console.log('No API key found in environment');
        return res.status(500).json({ error: 'API key not configured' });
    }
    
    res.json({ apiKey: process.env.API_KEY });
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// For Vercel deployment
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;