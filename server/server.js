/*
                    __ENV STRUCTURE__
PUBLIC_KEY: the client id (spotify)
PRIVATE_KEY: the client secret (spotify)
PORT: the port the server binds to

*/

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from 'body-parser';
import { loginRouter } from "./login";

// loads environment variables
dotenv.config();

// Loads in server features
const app = express();
app.use(express.json());
app.use(bodyParser.json());

// This allows requests to be made from the frontend
// For security, replace the origin with allowed URLs
app.use(cors({ origin: "*" }));

// Routes
app.use(loginRouter);

app.listen({port: parseInt(process.env.PORT)});

