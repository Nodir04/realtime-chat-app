const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and their typing status
const users = new Map();
const typingUsers = new Set();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Handle user joining with username
    socket.on('join', (username) => {
        // Store user information
        users.set(socket.id, {
            username: username || `User${Math.floor(Math.random() * 1000)}`,
            socketId: socket.id
        });

        const user = users.get(socket.id);
        
        // Notify all users about new user
        socket.broadcast.emit('user-joined', {
            username: user.username,
            message: `${user.username} joined the chat`,
            timestamp: new Date().toISOString()
        });

        // Send current online users count to all clients
        io.emit('users-count', users.size);
        
        console.log(`${user.username} joined the chat`);
    });

    // Handle new chat messages
    socket.on('chat-message', (data) => {
        const user = users.get(socket.id);
        if (user) {
            const messageData = {
                username: user.username,
                message: data.message,
                timestamp: new Date().toISOString(),
                socketId: socket.id
            };

            // Broadcast message to all connected clients
            io.emit('chat-message', messageData);
            console.log(`${user.username}: ${data.message}`);
        }
    });

    // Handle typing indicator
    socket.on('typing', (isTyping) => {
        const user = users.get(socket.id);
        if (user) {
            if (isTyping) {
                typingUsers.add(user.username);
            } else {
                typingUsers.delete(user.username);
            }

            // Broadcast typing status to all other users
            socket.broadcast.emit('typing-status', {
                username: user.username,
                isTyping: isTyping,
                typingUsers: Array.from(typingUsers)
            });
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            // Remove user from typing list
            typingUsers.delete(user.username);
            
            // Remove user from users map
            users.delete(socket.id);

            // Notify all users about user leaving
            socket.broadcast.emit('user-left', {
                username: user.username,
                message: `${user.username} left the chat`,
                timestamp: new Date().toISOString()
            });

            // Update online users count
            io.emit('users-count', users.size);
            
            console.log(`${user.username} disconnected`);
        }
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Chat server running on http://localhost:${PORT}`);
    console.log('📱 Open your browser and navigate to the URL above');
});