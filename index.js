// const express = require("express");    // "type" : "commonjs"    //3rd party package import
import express, { response } from "express";     // "type" : "module"
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();
import moviesRouter from './routes/movies.route.js';
import userRouter from './routes/user.route.js';
import cors from 'cors';
import { auth } from "./middleware/auth.js";

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
app.use(cors());

app.get("/", function (request, response) {
response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.use('/movies', moviesRouter);
app.use('/user', userRouter);

//--------------------------------------------------
// http://localhost:5000/mobiles

app.get('/mobiles', auth, async (request, response) => {
//get data from atlas
//db.mobiles.find({});
//find -> return cursor 
const mobiles = await client.db("b40wd").collection("mobiles").find( {} ).toArray();
    response.send(mobiles);
});
    
// /mobiles - POST
app.post('/mobiles', async (request, response) => {
    const data = request.body;
    //db.mobiles.insertMany(data);
    const result = await client.db("b40wd").collection("mobiles").insertMany(data);
    response.send(result);
});



app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export { client };
