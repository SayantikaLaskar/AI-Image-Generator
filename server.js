require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Serve static files with proper MIME types
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// API endpoint to get the API key
app.get('/api/config', (req, res) => {
    console.log('Config endpoint called');
    
    if (!process.env.API_KEY) {
        console.log('No API key found in environment');
        return res.status(500).json({ error: 'API key not configured' });
    }
    
    res.json({ apiKey: process.env.API_KEY });
});

// Serve CSS files explicitly
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

// Serve JS files explicitly
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle all other routes by serving index.html (for SPA routing)
app.get('*', (req, res) => {
    // Don't serve index.html for API routes or static files
    if (req.path.startsWith('/api/') || 
        req.path.endsWith('.css') || 
        req.path.endsWith('.js') || 
        req.path.endsWith('.png') || 
        req.path.endsWith('.jpg') || 
        req.path.endsWith('.ico')) {
        return res.status(404).send('Not found');
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// For local development
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
