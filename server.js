const net = require('net');
const connectDB = require('./config/db');
const dataController = require('./app/controllers/dataController');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

// Connect to MongoDB
connectDB();

// Create a TCP server for the Arduino data
const tcpServer = net.createServer((socket) => {
  console.log('Client connected:', socket.remoteAddress, socket.remotePort);

  // Handle incoming data
  socket.on('data', async (data) => {
    const hexData = data.toString('hex');
    console.log('Received hex data:', hexData);

    const response = await dataController.processData(hexData);
    socket.write(response);
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });

  // Handle errors
  socket.on('error', (err) => {
    console.error('Error:', err.message);
  });
});

// Start the TCP server
tcpServer.listen(port, host, () => {
  console.log(`TCP server listening on ${host}:${port}`);
});

// Create an HTTP server for Socket.io
const httpServer = createServer();
const io = require('socket.io')(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
    }
  });
  



// Start the HTTP server for Socket.io
httpServer.listen(port + 1, () => {
  console.log(`Socket.io server listening on port ${port + 1}`);
});
