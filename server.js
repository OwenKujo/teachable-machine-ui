const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Render
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Check if model files exist
app.get('/api/model-status', (req, res) => {
    const modelPath = path.join(__dirname, 'my_model');
    const requiredFiles = ['model.json', 'metadata.json'];
    
    try {
        if (!fs.existsSync(modelPath)) {
            return res.json({
                exists: false,
                message: 'Model folder not found. Please create a "my_model" folder with your exported Teachable Machine files.',
                files: []
            });
        }
        
        const files = fs.readdirSync(modelPath);
        const missingFiles = requiredFiles.filter(file => !files.includes(file));
        
        if (missingFiles.length > 0) {
            return res.json({
                exists: false,
                message: `Missing required model files: ${missingFiles.join(', ')}`,
                files: files,
                missing: missingFiles
            });
        }
        
        res.json({
            exists: true,
            message: 'Model files found and ready to use!',
            files: files
        });
        
    } catch (error) {
        res.status(500).json({
            exists: false,
            message: 'Error checking model files',
            error: error.message
        });
    }
});

// Serve model files with proper headers
app.get('/my_model/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            error: 'Model file not found',
            path: req.path,
            message: 'Please ensure your model files are in the my_model folder'
        });
    }
    
    // Set proper headers for model files
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(filePath);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: 'The requested resource was not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 AI Vision Classifier server running on http://localhost:${PORT}`);
    console.log(`📁 Model folder: ${path.join(__dirname, 'my_model')}`);
    console.log(`📖 Documentation: Check README.md for setup instructions`);
    
    // Check model status on startup
    const modelPath = path.join(__dirname, 'my_model');
    if (!fs.existsSync(modelPath)) {
        console.log(`⚠️  Model folder not found. Creating 'my_model' directory...`);
        fs.mkdirSync(modelPath, { recursive: true });
        console.log(`✅ Created 'my_model' folder. Please add your model files:`);
        console.log(`   - model.json`);
        console.log(`   - metadata.json`);
        console.log(`   - weights.bin (or similar weight files)`);
    } else {
        console.log(`✅ Model folder found`);
    }
});
