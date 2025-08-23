# AI Vision Classifier

A beautiful, modern web interface for your Teachable Machine image classification model. This application provides real-time object classification using your custom trained AI model.

## Features

✨ **Modern UI Design**
- Beautiful gradient backgrounds and glassmorphism effects
- Responsive design that works on all devices
- Smooth animations and transitions
- Professional typography with Inter font

🎯 **Enhanced Functionality**
- Real-time camera feed with high-quality video
- Live classification results with confidence bars
- Visual feedback for high-confidence predictions
- Status indicators and error handling
- Keyboard shortcuts (Spacebar to start/stop)

📱 **User Experience**
- Intuitive controls with clear visual feedback
- Error notifications with auto-dismiss
- Page visibility handling (pauses when tab is hidden)
- Responsive layout for mobile and desktop
- Loading states and progress indicators

## Setup Instructions

### 1. Prepare Your Model
1. Train your image classification model using [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Export your model as "Tensorflow.js" format
3. Download the exported model files

### 2. Install Model Files
1. Create a folder named `my_model` in the same directory as your HTML file
2. Place your exported model files in the `my_model` folder:
   - `model.json`
   - `metadata.json`
   - `weights.bin` (or similar weight files)

Your folder structure should look like this:
```
teachable-machine-ui/
├── index.html
├── styles.css
├── script.js
├── README.md
└── my_model/
    ├── model.json
    ├── metadata.json
    └── weights.bin
```

### 3. Run the Application
1. Open `index.html` in a modern web browser
2. Click "Start Camera" to begin classification
3. Allow camera permissions when prompted
4. Point your camera at objects to see real-time predictions

## Usage

### Starting the Camera
- Click the "Start Camera" button
- Or press the Spacebar key
- The button will change to "Stop Camera" when active

### Understanding Results
- Results are displayed in order of confidence (highest first)
- High-confidence predictions (>70%) are highlighted in green
- Each result shows:
  - Class name
  - Confidence bar visualization
  - Percentage confidence

### Controls
- **Start/Stop**: Click button or press Spacebar
- **Camera**: Automatically requests permission on first use
- **Responsive**: Automatically adjusts to screen size

## Technical Details

### Dependencies
- **TensorFlow.js**: For running the AI model
- **Teachable Machine Image Library**: For webcam and prediction handling
- **Font Awesome**: For icons
- **Inter Font**: For typography

### Browser Requirements
- Modern browser with WebRTC support
- HTTPS required for camera access (or localhost)
- JavaScript enabled

### Performance
- Optimized for real-time predictions
- Efficient memory management
- Automatic cleanup when stopping camera

## Customization

### Changing Model Path
Edit the `URL` variable in `script.js`:
```javascript
const URL = "./my_model/"; // Change this to your model path
```

### Styling
The application uses CSS custom properties and can be easily customized:
- Colors are defined in the CSS file
- Animations can be adjusted
- Layout can be modified for different screen sizes

### Adding Features
The modular JavaScript structure makes it easy to add:
- Additional controls
- Different visualization methods
- Export functionality
- Custom prediction handling

## Troubleshooting

### Camera Not Working
- Ensure you're using HTTPS or localhost
- Check browser permissions for camera access
- Try refreshing the page

### Model Not Loading
- Verify all model files are in the `my_model` folder
- Check file names match exactly
- Ensure model files are not corrupted

### Performance Issues
- Close other applications using the camera
- Reduce browser tab count
- Check system resources

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using TensorFlow.js and Teachable Machine
