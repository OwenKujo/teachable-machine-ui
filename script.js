// AI Vision Classifier - Enhanced JavaScript
// More API functions here: https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// Configuration
const URL = "./my_model/";
let model, webcam, labelContainer, maxPredictions;
let isRunning = false;
let animationId = null;

// DOM Elements
const startBtn = document.getElementById('startBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const classCount = document.getElementById('classCount');

// Check model status on page load
async function checkModelStatus() {
    try {
        const response = await fetch('/api/model-status');
        const data = await response.json();
        
        if (!data.exists) {
            showModelError(data.message);
            return false;
        }
        
        console.log('✅ Model files found:', data.files);
        return true;
    } catch (error) {
        console.error('Error checking model status:', error);
        showModelError('Unable to check model status. Please ensure the server is running.');
        return false;
    }
}

// Show model setup error
function showModelError(message) {
    const webcamContainer = document.getElementById("webcam-container");
    const labelContainer = document.getElementById("label-container");
    
    webcamContainer.innerHTML = `
        <div class="model-error">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Model Setup Required</h3>
            <p>${message}</p>
            <div class="setup-instructions">
                <h4>Setup Instructions:</h4>
                <ol>
                    <li>Export your model from Teachable Machine as "Tensorflow.js"</li>
                    <li>Create a folder named "my_model" in this directory</li>
                    <li>Place these files in the my_model folder:
                        <ul>
                            <li>model.json</li>
                            <li>metadata.json</li>
                            <li>weights.bin (or similar)</li>
                        </ul>
                    </li>
                    <li>Refresh this page</li>
                </ol>
            </div>
        </div>
    `;
    
    labelContainer.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-info-circle"></i>
            <p>Add your model files to see predictions</p>
        </div>
    `;
    
    updateStatus('error', 'Model not found');
    startBtn.disabled = true;
    startBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Setup Required</span>';
}

// Initialize the application
async function init() {
    if (isRunning) {
        await stopCamera();
        return;
    }

    // Check if model is available first
    const modelAvailable = await checkModelStatus();
    if (!modelAvailable) {
        return;
    }

    try {
        updateStatus('loading', 'Loading model...');
        startBtn.classList.add('loading');
        
        // Load the model and metadata
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        // Update class count display
        classCount.textContent = maxPredictions;
        
        updateStatus('loading', 'Setting up camera...');
        
        // Setup webcam
        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip); // Increased size for better quality
        await webcam.setup();
        await webcam.play();
        
        // Clear placeholders and setup containers
        setupContainers();
        
        // Start prediction loop
        isRunning = true;
        updateStatus('active', 'Camera active');
        updateButtonState();
        
        // Start the prediction loop
        loop();
        
    } catch (error) {
        console.error('Error initializing:', error);
        updateStatus('error', 'Failed to start camera');
        showError('Failed to initialize camera. Please check your model files and camera permissions.');
    } finally {
        startBtn.classList.remove('loading');
    }
}

// Setup containers for webcam and results
function setupContainers() {
    const webcamContainer = document.getElementById("webcam-container");
    const labelContainer = document.getElementById("label-container");
    
    if (!webcamContainer || !labelContainer) {
        console.error('Required containers not found');
        return;
    }
    
    // Clear placeholders
    webcamContainer.innerHTML = '';
    labelContainer.innerHTML = '';
    
    // Add webcam canvas
    webcamContainer.appendChild(webcam.canvas);
    
    // No need to pre-create result containers since we'll create them dynamically
    // The predict function will create a single container for the top prediction
    
    // Store reference to labelContainer globally
    window.labelContainer = labelContainer;
}

// Main prediction loop
async function loop() {
    if (!isRunning) return;
    
    webcam.update();
    await predict();
    animationId = window.requestAnimationFrame(loop);
}

// Run predictions on webcam feed
async function predict() {
    try {
        const prediction = await model.predict(webcam.canvas);
        
        // Sort predictions by confidence
        prediction.sort((a, b) => b.probability - a.probability);
        
        // Get the label container
        const labelContainer = window.labelContainer || document.getElementById("label-container");
        if (!labelContainer) {
            console.error('Label container not found');
            return;
        }
        
        // Show only the top prediction (highest confidence)
        const topPrediction = prediction[0]; // First item after sorting is the highest
        
        // Clear all previous results
        labelContainer.innerHTML = '';
        
        // Create single result div for the top prediction
        const resultDiv = document.createElement("div");
        resultDiv.className = "result-item top-prediction";
        
        const confidence = topPrediction.probability.toFixed(2);
        const percentage = (topPrediction.probability * 100).toFixed(1);
        
        resultDiv.innerHTML = `
            <div class="result-content">
                <span class="class-name">${topPrediction.className}</span>
                <span class="confidence-bar">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                </span>
            </div>
            <span class="confidence-value">${percentage}%</span>
        `;
        
        // Add visual feedback for high confidence predictions
        if (topPrediction.probability > 0.7) {
            resultDiv.classList.add('high-confidence');
        } else {
            resultDiv.classList.remove('high-confidence');
        }
        
        // Add the result to the container
        labelContainer.appendChild(resultDiv);
        
    } catch (error) {
        console.error('Prediction error:', error);
        updateStatus('error', 'Prediction failed');
    }
}

// Stop camera and cleanup
async function stopCamera() {
    isRunning = false;
    
    if (animationId) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    if (webcam) {
        webcam.stop();
        webcam = null;
    }
    
    // Reset containers to placeholder state
    resetContainers();
    
    updateStatus('ready', 'Ready to start');
    updateButtonState();
}

// Reset containers to initial state
function resetContainers() {
    const webcamContainer = document.getElementById("webcam-container");
    const labelContainer = document.getElementById("label-container");
    
    webcamContainer.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-camera-slash"></i>
            <p>Camera not active</p>
        </div>
    `;
    
    labelContainer.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-info-circle"></i>
            <p>Start the camera to see predictions</p>
        </div>
    `;
}

// Update status indicator
function updateStatus(type, message) {
    statusText.textContent = message;
    statusDot.className = 'status-dot';
    
    switch (type) {
        case 'ready':
            statusDot.classList.add('ready');
            break;
        case 'loading':
            statusDot.classList.add('loading');
            break;
        case 'active':
            statusDot.classList.add('active');
            break;
        case 'error':
            statusDot.classList.add('error');
            break;
    }
}

// Update button state
function updateButtonState() {
    if (isRunning) {
        startBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Camera</span>';
        startBtn.classList.add('running');
    } else {
        startBtn.innerHTML = '<i class="fas fa-play"></i><span>Start Camera</span>';
        startBtn.classList.remove('running');
    }
}

// Show error message
function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isRunning) {
        // Pause camera when page is not visible
        updateStatus('ready', 'Page hidden - camera paused');
    } else if (!document.hidden && isRunning) {
        // Resume camera when page becomes visible
        updateStatus('active', 'Camera active');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (webcam && isRunning) {
        // Adjust webcam size if needed
        const container = document.getElementById("webcam-container");
        const containerWidth = container.offsetWidth;
        if (containerWidth < 400) {
            webcam.canvas.style.width = '100%';
            webcam.canvas.style.height = 'auto';
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        init();
    }
});

// Initialize status on page load
document.addEventListener('DOMContentLoaded', async () => {
    updateStatus('ready', 'Checking model...');
    
    // Check model status first
    await checkModelStatus();
    
    // Add some CSS for the new elements
    const style = document.createElement('style');
    style.textContent = `
        .result-item {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            margin: 10px 0;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
            border-left: 4px solid #667eea;
        }
        
        .result-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .result-item.high-confidence {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            border-left-color: #28a745;
        }
        
        .result-content {
            display: flex;
            flex-direction: column;
            gap: 5px;
            flex: 1;
        }
        
        .class-name {
            font-weight: 600;
            color: #333;
        }
        
        .confidence-bar {
            width: 100%;
            height: 6px;
            background: #e9ecef;
            border-radius: 3px;
            overflow: hidden;
        }
        
        .bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
        }
        
        .confidence-value {
            font-weight: 600;
            color: #667eea;
            min-width: 50px;
            text-align: right;
        }
        
        .error-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 20px rgba(244, 67, 54, 0.3);
        }
        
        .error-notification button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .error-notification button:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .model-error {
            text-align: center;
            color: #666;
            padding: 20px;
        }
        
        .model-error i {
            font-size: 4rem;
            margin-bottom: 20px;
            color: #ff9800;
        }
        
        .model-error h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .model-error p {
            margin-bottom: 20px;
            font-size: 1.1rem;
        }
        
        .setup-instructions {
            text-align: left;
            background: rgba(255, 255, 255, 0.8);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        
        .setup-instructions h4 {
            color: #667eea;
            margin-bottom: 15px;
        }
        
        .setup-instructions ol {
            margin-left: 20px;
        }
        
        .setup-instructions li {
            margin-bottom: 10px;
        }
        
        .setup-instructions ul {
            margin-left: 20px;
            margin-top: 5px;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .status-dot.ready {
            background: #ccc;
        }
        
        .status-dot.loading {
            background: #ff9800;
            animation: pulse 1s infinite;
        }
        
        .top-prediction {
            font-size: 1.2rem;
            padding: 20px 25px;
            margin: 15px 0;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            border-left-width: 6px;
        }
        
        .top-prediction .class-name {
            font-size: 1.4rem;
            font-weight: 700;
        }
        
        .top-prediction .confidence-value {
            font-size: 1.3rem;
            font-weight: 700;
        }
        
        .top-prediction .confidence-bar {
            height: 8px;
            margin-top: 8px;
        }
    `;
    document.head.appendChild(style);
});
