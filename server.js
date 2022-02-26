require("dotenv").config();

const express = require('express');
const cors = require("cors");
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const clientHostName = process.env.CLIENT_HOSTNAME || "http://localhost:3000";

var allowedOrigins = [
  clientHostName,
  `${clientHostName}/create-user`,
  `${clientHostName}/about`,
]

var corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Drakarenan server..." });
});

const PORT = process.env.PORT || 8080;

require("./app/routes/userroot.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/steam.routes.js")(app, PORT);
require("./app/routes/arenas.routes.js")(app, io)


// sets port, listen for requests

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


//STEAM API KEY: 1AD36964899812CA1271CDF4D6251B79