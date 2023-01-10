// const express = require("express");    // "type" : "commonjs"    //3rd party package import
import express from "express";     // "type" : "module"
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();


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


// Task 1
// http://localhost:5000/movies - movies(data)
// app.get("/movies", function (request, response) {    // 1st method use -> get , / -> homepage
// response.send(movies);
// });


// Task 2
// http://localhost:5000/movies/99 - movies(data)
// app.get("/movies/:id", function (request, response) {    
// const {id} = request.params;
// console.log(request.params, id);
// const movie = movies.find((mv) => mv.id == id);
// console.log(movie);
// movie ? response.send(movie) : response.status(404).send({message : "movie not found"}); 
// });


// Get data from Mongodb 
app.get("/movies/:id",  async function (request, response) {    
const {id} = request.params;
const movie = await client.db("test").collection("movies").findOne({ id: id});
console.log(movie);
movie ? response.send(movie) : response.status(404).send({message : "movie not found"}); 
});


// create api POST - Create
app.post("/movies",  async function (request, response) {   
const data = request.body;
console.log(data);
const result = await client.db("test").collection("movies").insertMany(data);
response.send(result);
});


//Find - GET - Read
//Cursor - pagination | Cursor -> Array | toArray()
// app.get("/movies", async function (request, response) {   
// const movies = await client.db("test").collection("movies").find({}).toArray();
// // const movie = movies.find((mv) => mv.id == id);
// console.log(movies);
//  response.send(movies);
// });


//Delete
app.delete("/movies/:id",  async function (request, response) {    
const {id} = request.params;
const result = await client.db("test").collection("movies").deleteOne({ id: id});
console.log(result);
result.deletedCount > 0 ? response.send({message : "movie deleted successfully"}) : response.status(404).send({message : "movie not found"}); 
});


//PUT - Update
app.put("/movies/:id",  async function (request, response) {  
//  db.movies.updateOne({ id : '99'}, {$set : {rating : 9}})  
const {id} = request.params;
const data = request.body;
const result = await client.db("test").collection("movies").updateOne({ id: id}, {$set : data});
console.log(result); 
response.send(result);
});


//Filter
// Query params
app.get("/movies", async function (request, response) {    // 1st method use -> get , / -> homepage
if (request.query.rating) {
request.query.rating = +request.query.rating;
}
console.log(request.query);
const movies = await client.db("test").collection("movies").find(request.query).toArray();
response.send(movies);
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));


