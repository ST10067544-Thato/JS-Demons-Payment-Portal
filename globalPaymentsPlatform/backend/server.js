const https = require('https')
const dotenv = require('dotenv').config()
const fs = require('fs')
const app = require('./app')

// Set the port for the server. Either use the value from the .env file or default to 5000
const PORT = process.env.PORT || 5000

 
// Define options for the HTTPS server using SSL/TLS certificates
const options = {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/certificate.pem')
}

// Create an HTTPS server using the specified options and the Express app
const server = https.createServer(options, app)

// Start the server and have it listen on the specified port
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
 