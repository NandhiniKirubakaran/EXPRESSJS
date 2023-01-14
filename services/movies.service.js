import { client } from "../index.js";

export async function getMoviesbyid(id) {
    return await client.db("test").collection("movies").findOne({ id: id });
}
export async function postMovies(data) {
    return await client.db("test").collection("movies").insertMany(data);
}
export async function deleteMovies(id) {
    return await client.db("test").collection("movies").deleteOne({ id: id });
}
export async function updateMovies(id, data) {
    return await client.db("test").collection("movies").updateOne({ id: id }, { $set: data });
}
export async function getMovies(request) {
    return await client.db("test").collection("movies").find(request.query).toArray();
}  
