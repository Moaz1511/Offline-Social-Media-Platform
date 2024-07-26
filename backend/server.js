const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS options
const corsOptions = {
    origin: function (origin, callback) {
        console.log('Origin:', origin); // Log origin for debugging
        if (['http://localhost:3000', 'http://192.168.1.107:3000'].indexOf(origin) !== -1 || !origin || origin.startsWith('http://192.168.1.')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/likes', require('./routes/likes'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/socialplatform', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.1.107:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('post', (data) => {
        io.emit('post', data);
    });
    socket.on('comment', (data) => {
        io.emit('comment', data);
    });
    socket.on('like', (data) => {
        io.emit('like', data);
    });
    socket.on('unlike', (data) => {
        io.emit('unlike', data);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
