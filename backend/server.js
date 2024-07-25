// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/socialplatform', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));


// backend/server.js
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// backend/server.js
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

// backend/server.js
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('post', (data) => {
        io.emit('post', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
