// const express = require("express");    // "type" : "commonjs"    //3rd party package import
import express, { response } from "express";     // "type" : "module"
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();
import moviesRouter from './routes/movies.route.js';
import userRouter from './routes/user.route.js';
import cors from 'cors';
import { auth } from "./middleware/auth.js";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";


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

// /mobiles - GET
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

const ROLE_ID = {
    ADMIN: "0",
    NORMAL_USER: "1",
};

// /mobiles - DELETE
app.delete("/mobiles/:id", auth, async function (request, response) {    
    const {id} = request.params;
    //db.mobiles.deleteOne({_id: 100})
    const { roleId } = request;

    if (roleId == ROLE_ID.ADMIN) {
        const result = await client.db("b40wd").collection("mobiles").deleteOne({ _id: ObjectId(id) });
        console.log(result);
        result.deletedCount > 0 ? response.send({message : "mobile deleted successfully"}) : response.status(404).send({message : "mobile not found"}); 
    } else {
        response.status(401).send({ message: "Unauthorized" });
    } 
});
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));




export { client };

//Mail send

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nandhini Kirubakaran" <knaphasri@gmail.com>', // sender address
    to: "baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);