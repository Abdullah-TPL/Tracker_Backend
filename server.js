const net = require('net');
const connectDB = require('./config/db');
const dataController = require('./app/controllers/dataController');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const os = require('os');
const axios = require('axios');

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || getLocalIpAddress(); // Get local IP dynamically

// Function to get the local IP address of the server
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceDetails = interfaces[interfaceName];
    for (const iface of interfaceDetails) {
      // Look for internal IPv4 addresses (ignore IPv6 and loopback)
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Default to localhost if no valid IP found
}

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

// Function to fetch public IP address
async function getPublicIpAddress() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching public IP:', error.message);
    return 'Public IP not available';
  }
}

// Handle Socket.io connections
io.on('connection', async (socket) => {
  console.log('Socket.io client connected:', socket.id);

  // Fetch and print public IP address of client
  const publicIP = await getPublicIpAddress();
  console.log('Public IP of client:', publicIP);

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
