# 💬 Real-Time Chat Application

A modern, real-time chat application built with **Node.js**, **Express**, and **Socket.io**. Features instant messaging, typing indicators, emoji support, and a responsive design.

## 🌟 Features

### Core Features
- **Real-time messaging** using WebSockets (Socket.io)
- **Instant message delivery** to all connected clients
- **Clean, responsive UI** that works on desktop and mobile
- **User-friendly chat interface** with message history

### Bonus Features
- **"User is typing..." indicator** shows when someone is composing a message
- **Emoji support** with built-in emoji picker
- **Online user counter** displays number of connected users
- **Join/leave notifications** when users connect or disconnect
- **Message timestamps** with proper formatting
- **Auto-scroll** to latest messages
- **Responsive design** optimized for all screen sizes

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone or download** the project files
2. **Navigate** to the project directory
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

1. **Start the server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

3. **Enter a username** and start chatting!

## 📁 Project Structure

```
realtime-chat-app/
├── server.js              # Node.js + Socket.io server
├── package.json           # Dependencies and scripts
├── README.md             # This file
└── public/               # Frontend files
    ├── index.html        # Main HTML structure
    ├── style.css         # CSS styling
    └── script.js         # Client-side JavaScript
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, Socket.io
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Real-time Communication**: WebSockets via Socket.io
- **Styling**: Modern CSS with Flexbox and Grid

## 🎮 How to Use

1. **Enter Username**: When you first visit the app, enter your desired username
2. **Start Chatting**: Type messages in the input field and press Enter or click Send
3. **Use Emojis**: Click the 😊 button to open the emoji picker
4. **See Who's Online**: The header shows the number of connected users
5. **Typing Indicators**: See when others are typing a message

## 🔧 Configuration

### Port Configuration
The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

### Customization Options
- **Username length**: Currently limited to 20 characters (configurable in `server.js`)
- **Message length**: Limited to 500 characters (configurable in `index.html`)
- **Typing timeout**: 3 seconds (configurable in `script.js`)

## 🚀 Deployment

### Local Network Access
To allow other devices on your network to access the chat:

1. Find your local IP address
2. Start the server: `npm start`
3. Others can connect via: `http://YOUR_IP:3000`

### Cloud Deployment
This app can be deployed to any Node.js hosting service like:
- Heroku
- Railway
- Render
- DigitalOcean App Platform

## 🔍 Features Explained

### Real-time Messaging
- Uses Socket.io for bidirectional communication
- Messages appear instantly on all connected clients
- No page refresh needed

### Typing Indicators
- Shows "User is typing..." when someone is composing
- Automatically clears after 3 seconds of inactivity
- Handles multiple users typing simultaneously

### Emoji Support
- Built-in emoji picker with popular emojis
- Click-to-insert functionality
- Supports unicode emojis in messages

### User Management
- Simple username system (no authentication required)
- Automatic user count updates
- Join/leave notifications

## 🐛 Troubleshooting

### Common Issues

**Port already in use**:
```bash
Error: listen EADDRINUSE: address already in use :::3000
```
Solution: Use a different port or kill the process using port 3000

**Connection issues**:
- Check if the server is running
- Verify the correct URL (http://localhost:3000)
- Check browser console for errors

**Messages not sending**:
- Ensure you've entered a username
- Check network connection
- Refresh the page if needed

## 📝 Development Notes

### Code Structure
- **Modular design** with separate concerns
- **Event-driven architecture** using Socket.io
- **ES6+ JavaScript** with modern syntax
- **Responsive CSS** using Flexbox and Grid

### Security Considerations
- Input sanitization to prevent XSS
- Message length limits
- Username validation
- No persistent data storage (messages are not saved)

### Performance Features
- Efficient DOM manipulation
- Optimized scrolling
- Minimal memory usage
- Clean event listener management

## 🤝 Contributing

Feel free to contribute to this project! Some ideas for improvements:
- User authentication
- Private messaging
- Message persistence
- File sharing
- Voice/video chat
- Custom themes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Enjoy Chatting!

Start the server, invite your friends, and enjoy real-time conversations! 🚀
