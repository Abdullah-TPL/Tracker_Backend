const net = require('net');
const connectDB = require('./config/db');
const dataController = require('./app/controllers/dataController');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

// Connect to MongoDB
connectDB();

// Create a TCP server for Arduino data
const tcpServer = net.createServer((socket) => {
  console.log('Client connected:', socket.remoteAddress, socket.remotePort);

  // Handle incoming data from Arduino
  socket.on('data', async (data) => {
    const hexData = data.toString('hex');
    console.log('Received hex data:', hexData);

    try {
      const response = await dataController.processData(hexData);
      socket.write(response); // Send response back to Arduino if needed
    } catch (err) {
      console.error('Error processing data:', err.message);
    }
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });

  // Handle errors
  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
});

// Start the TCP server
tcpServer.listen(port, host, () => {
  console.log(`TCP server listening on ${host}:${port}`);
});

// Create an HTTP server
const httpServer = http.createServer();

// Initialize Socket.io
const io = socketIo(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*', // Adjust as needed
    methods: ['GET', 'POST'],
  }
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('Socket.io client connected:', socket.id);

  // Example event handling
  socket.on('message', (data) => {
    console.log('Message from client:', data);
    // Handle message or broadcast to others
    socket.broadcast.emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Socket.io client disconnected:', socket.id);
  });
});

// Start the HTTP server for Socket.io
httpServer.listen(port + 1, host, () => {
  console.log(`Socket.io server listening on ${host}:${port + 1}`);
});
