const net = require('net');
const connectDB = require('./config/db');
const dataController = require('./app/controllers/dataController');

const port = 3000;
const host = '0.0.0.0';

// Connect to MongoDB
connectDB();

// Create a server instance
const server = net.createServer((socket) => {
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

// Start the server
server.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
