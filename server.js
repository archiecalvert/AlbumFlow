/*
                    __ENV STRUCTURE__
PUBLIC_KEY: the client id (spotify)
PRIVATE_KEY: the client secret (spotify)
PORT: the port the server binds to
RANDOM_KEY: used for additional security
*/

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from 'body-parser';
import { loginRouter } from "./login.js";

// loads environment variables
dotenv.config();

// Loads in server features
const server = express();
server.use(express.json());
server.use(bodyParser.json());
server.use(cors({origin: "*"}))

// This allows requests to be made from the frontend
// For security, replace the origin with allowed URLs
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Or specific domain
  //res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Routes
server.use(loginRouter);

// Binds the server to a port
const port = server.listen({port: parseInt(process.env.PORT)});
process.on('SIGINT', function () {
    port.close(() => {
        console.log('\nShutting down server...');
        process.exit();
    });
});

console.log("Server Running...");
