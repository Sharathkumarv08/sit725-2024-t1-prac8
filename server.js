const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors'); 
const courseController = require('./Controller/courseController.js');
const CourseSelection = require('./Model/courseModel.js');

const path = require('path'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);  
const PORT = process.env.PORT || 3000;

// Database Connection
mongoose.connect('mongodb://host.docker.internal:27017/SIT725_dbconnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static('public'));

// Socket.io Connection Handler
io.on('connection', (socket) => {
    console.log('A user connected with socket id:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
    
    socket.emit('serverMessage', 'Connected to the server via WebSocket.');
});

// HTTP Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', courseController.submitCourseForm);

app.get('/courses', async (req, res) => {
    try {
        const courses = await CourseSelection.find({});
        res.status(200).json(courses);
    } catch (err) {
        console.error('Failed to retrieve courses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Starts the server with the http module
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app; // Exports the app for testing purposes
