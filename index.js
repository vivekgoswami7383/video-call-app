const express = require("express");
const app = express();
const port = 5000;
require("./database/database");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const options = {
  key: fs.readFileSync(path.join(__dirname,'./cert/key.pem')),
  cert: fs.readFileSync(path.join(__dirname,'./cert/cert.pem')),
  requestCert: true,
  ca: [
    fs.readFileSync(path.join(__dirname,'./cert/cert.pem')),
  ],
  rejectUnauthorized: false
}

var ExpressPeerServer = require('peer').ExpressPeerServer;

var peerOptions = {
    debug: true,
    // ssl: {
    //   key: fs.readFileSync('./cert/key.pem'),
    //   certificate: fs.readFileSync('./cert/cert.pem')
    // }
}

const server = http.createServer(app);
// const server = https.createServer(options,app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public/"));
// app.use('/peerjs', ExpressPeerServer(server, peerOptions));

const socketConnection = require("./socket");
socketConnection(server);

app.get("/", (req, res) => {
  try {
    res.render("index.html");
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error.message
    });
  }
});

server.listen(port,() => {
  console.log(`Server running on port ${port}`);
});