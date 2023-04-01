import express from "express";
import db from "./config/database.js";
import registerMahasiswa from "./routes/index.js";
import cors from "cors";
 
const app = express();
console.log("working");

try {
    await db.authenticate();
    console.log('Database connected...');
} catch (error) {
    console.error('Connection error:', error);
}

// const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(cors());
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });
app.use('', registerMahasiswa);
 
app.listen(5000, () => console.log('Server running at port 5000'));