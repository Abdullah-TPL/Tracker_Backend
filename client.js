const net = require('net');

// Replace with your server's IP and port
const PORT = 3000;
const HOST = '192.168.56.1';

// Create a client instance
const client = new net.Socket();

// Connect to the server
client.connect(PORT, HOST, () => {
  console.log('Connected to server');

  // Send hex data to the server
  // This hex data should represent the text "861245055021751|14,0|v1|r5|26092023|104012|153.05|24.838153|67.122322|0.00|52.533207|4.25|13.21|0|0|1|1|0|0|0|0|0|0.10|-0.06|-1.40|1|1|"
  const hexData = '3836313234353035353032313735317C31342C307C76317C72337C32363039323032337C3130343031327C3135332E30357C32342E3833383135337C36372E3132323332327C302E30307C35322E3533333230377C342E32357C31332E32317C307C307C317C317C307C307C307C307C307C302E31307C2D302E30367C2D312E34307C317C317C';
  client.write(Buffer.from(hexData, 'hex'));
});

// Receive data from the server
client.on('data', (data) => {
  console.log('Received:', data.toString());
  client.destroy(); // Close the connection
});

// Handle client error
client.on('error', (err) => {
  console.error('Error:', err.message);
});

// Handle client close
client.on('close', () => {
  console.log('Connection closed');
});
