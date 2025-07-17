// Initialize Socket.io connection
const socket = io();

// DOM elements
const usernameModal = document.getElementById('username-modal');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const usersCount = document.getElementById('users-count');
const typingIndicator = document.getElementById('typing-indicator');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');

// Global variables
let currentUser = null;
let isTyping = false;
let typingTimer = null;
let isEmojiPickerOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Focus on username input
    usernameInput.focus();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup socket listeners
    setupSocketListeners();
});

// Setup DOM event listeners
function setupEventListeners() {
    // Username modal events
    joinBtn.addEventListener('click', joinChat);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            joinChat();
        }
    });

    // Message input events
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Send button event
    sendBtn.addEventListener('click', sendMessage);

    // Typing indicator events
    messageInput.addEventListener('input', handleTyping);
    messageInput.addEventListener('focus', handleTyping);
    messageInput.addEventListener('blur', stopTyping);

    // Emoji picker events
    emojiBtn.addEventListener('click', toggleEmojiPicker);
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!emojiPicker.contains(e.target) && !emojiBtn.contains(e.target)) {
            closeEmojiPicker();
        }
    });

    // Emoji selection
    emojiPicker.addEventListener('click', (e) => {
        if (e.target.classList.contains('emoji')) {
            insertEmoji(e.target.textContent);
        }
    });
}

// Setup Socket.io event listeners
function setupSocketListeners() {
    // Connection status
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        showSystemMessage('Disconnected from server. Trying to reconnect...');
    });

    // Chat events
    socket.on('chat-message', (data) => {
        displayMessage(data);
    });

    socket.on('user-joined', (data) => {
        showSystemMessage(data.message);
    });

    socket.on('user-left', (data) => {
        showSystemMessage(data.message);
    });

    socket.on('users-count', (count) => {
        usersCount.textContent = count;
    });

    socket.on('typing-status', (data) => {
        updateTypingIndicator(data.typingUsers);
    });

    // Error handling
    socket.on('error', (error) => {
        console.error('Socket error:', error);
        showSystemMessage('Connection error occurred');
    });
}

// Join chat function
function joinChat() {
    const username = usernameInput.value.trim();
    
    if (username === '') {
        alert('Please enter a username');
        return;
    }

    if (username.length > 20) {
        alert('Username must be 20 characters or less');
        return;
    }

    currentUser = username;
    
    // Hide modal and enable chat
    usernameModal.style.display = 'none';
    messageInput.disabled = false;
    sendBtn.disabled = false;
    emojiBtn.disabled = false;
    
    // Focus on message input
    messageInput.focus();
    
    // Join the chat room
    socket.emit('join', username);
    
    // Remove welcome message
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
}

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message === '') {
        return;
    }

    // Emit message to server
    socket.emit('chat-message', { message });
    
    // Clear input
    messageInput.value = '';
    
    // Stop typing indicator
    stopTyping();
    
    // Focus back on input
    messageInput.focus();
}

// Display message in chat
function displayMessage(data) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${data.socketId === socket.id ? 'own' : 'other'}`;
    
    const timestamp = new Date(data.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageDiv.innerHTML = `
        <div class="message-header">${data.username}</div>
        <div class="message-content">${escapeHtml(data.message)}</div>
        <div class="message-time">${timestamp}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Show system message
function showSystemMessage(message) {
    const systemDiv = document.createElement('div');
    systemDiv.className = 'system-message';
    systemDiv.textContent = message;
    
    messagesContainer.appendChild(systemDiv);
    scrollToBottom();
}

// Handle typing indicator
function handleTyping() {
    if (!isTyping) {
        isTyping = true;
        socket.emit('typing', true);
    }
    
    // Clear existing timer
    clearTimeout(typingTimer);
    
    // Set new timer to stop typing after 3 seconds
    typingTimer = setTimeout(() => {
        stopTyping();
    }, 3000);
}

// Stop typing indicator
function stopTyping() {
    if (isTyping) {
        isTyping = false;
        socket.emit('typing', false);
    }
    clearTimeout(typingTimer);
}

// Update typing indicator display
function updateTypingIndicator(typingUsers) {
    if (typingUsers.length === 0) {
        typingIndicator.textContent = '';
        return;
    }
    
    // Filter out current user from typing list
    const othersTyping = typingUsers.filter(user => user !== currentUser);
    
    if (othersTyping.length === 0) {
        typingIndicator.textContent = '';
        return;
    }
    
    let message = '';
    if (othersTyping.length === 1) {
        message = `${othersTyping[0]} is typing`;
    } else if (othersTyping.length === 2) {
        message = `${othersTyping[0]} and ${othersTyping[1]} are typing`;
    } else {
        message = `${othersTyping[0]} and ${othersTyping.length - 1} others are typing`;
    }
    
    typingIndicator.innerHTML = `${message}<span class="typing-dots"></span>`;
}

// Emoji picker functions
function toggleEmojiPicker() {
    if (isEmojiPickerOpen) {
        closeEmojiPicker();
    } else {
        openEmojiPicker();
    }
}

function openEmojiPicker() {
    emojiPicker.classList.add('show');
    isEmojiPickerOpen = true;
}

function closeEmojiPicker() {
    emojiPicker.classList.remove('show');
    isEmojiPickerOpen = false;
}

function insertEmoji(emoji) {
    const cursorPos = messageInput.selectionStart;
    const textBefore = messageInput.value.substring(0, cursorPos);
    const textAfter = messageInput.value.substring(cursorPos);
    
    messageInput.value = textBefore + emoji + textAfter;
    
    // Move cursor after emoji
    messageInput.selectionStart = messageInput.selectionEnd = cursorPos + emoji.length;
    
    // Focus back on input
    messageInput.focus();
    
    // Close emoji picker
    closeEmojiPicker();
    
    // Trigger typing indicator
    handleTyping();
}

// Utility functions
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle page visibility for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, stop typing indicator
        stopTyping();
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    socket.disconnect();
});