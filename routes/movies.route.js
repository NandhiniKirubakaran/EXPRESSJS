import express from "express";
import { getMoviesbyid, postMovies, deleteMovies, updateMovies, getMovies } from "../services/movies.service.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Task 1
// http://localhost:5000/movies - movies(data)
// router.get("/movies", function (request, response) {    // 1st method use -> get , / -> homepage
// response.send(movies);
// });


// Task 2
// http://localhost:5000/movies/99 - movies(data)
// router.get("/movies/:id", function (request, response) {    
// const {id} = request.params;
// console.log(request.params, id);
// const movie = movies.find((mv) => mv.id == id);
// console.log(movie);
// movie ? response.send(movie) : response.status(404).send({message : "movie not found"}); 
// });


// Get data from Mongodb 
router.get("/:id", async function (request, response) {    
const {id} = request.params;
const movie = await getMoviesbyid(id);
console.log(movie);
movie ? response.send(movie) : response.status(404).send({message : "movie not found"}); 
});
    
    
// create api POST - Create
router.post("/",  async function (request, response) {   
const data = request.body;
console.log(data);
const result = await postMovies(data);
response.send(result);
});
    
    
//Find - GET - Read
//Cursor - pagination | Cursor -> Array | toArray()
// router.get("/", async function (request, response) {   
// const movies = await client.db("test").collection("movies").find({}).toArray();
// // const movie = movies.find((mv) => mv.id == id);
// console.log(movies);
//  response.send(movies);
// });
    
    
//Delete
router.delete("/:id",  async function (request, response) {    
const {id} = request.params;
const result = await deleteMovies(id);
console.log(result);
result.deletedCount > 0 ? response.send({message : "movie deleted successfully"}) : response.status(404).send({message : "movie not found"}); 
});
    
    
//PUT - Update
router.put("/:id",  async function (request, response) {  
//  db.movies.updateOne({ id : '99'}, {$set : {rating : 9}})  
const {id} = request.params;
const data = request.body;
const result = await updateMovies(id, data);
console.log(result); 
response.send(result);
});
    
    
//Filter
// Query params
router.get("/", async function (request, response) {    // 1st method use -> get , / -> homepage
if (request.query.rating) {
request.query.rating = +request.query.rating;
}
console.log(request.query);
const movies = await getMovies(request);
response.send(movies);
 });

 export default router;


