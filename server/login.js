import express from 'express';
import dotenv from "dotenv";

// loads env
dotenv.config("./");

// api router
const loginRouter = express.Router();



export {loginRouter};