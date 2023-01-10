// const express = require("express");    // "type" : "commonjs"    //3rd party package import
import express from "express";     // "type" : "module"
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();
import moviesRouter from './routes/movies.route.js';

//env - Environment variables
console.log(process.env.MONGO_URL);

const app = express();

const PORT = process.env.PORT;    //Auto assign PORT

//Connection Code
// const MONGO_URL = 'mongodb://127.0.0.1';
const MONGO_URL = process.env.MONGO_URL;    //default ip of mongo
const client = new MongoClient(MONGO_URL);   //dial
//Top level await
await client.connect();       //call
console.log("Mongo is connected!!!");
    

// xml json text
// middleware - express.json() - JSON -> JS object
// app.use -> Intercepts -> applies express.json()
app.use(express.json());


app.get("/", function (request, response) {
response.send("🙋‍♂️, 🌏 🎊✨🤩");
});


app.use('/movies', moviesRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export { client };
