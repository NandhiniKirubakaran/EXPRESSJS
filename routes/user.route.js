import express from "express";
import { createUser, generateHashedpassword, getUserByName } from "../services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = express.Router();

// Signup API-POST - Create
router.post("/signup",  async function (request, response) {   
    const { username, password } = request.body;
//db.users.insertOne(data);

const userFromDB = await getUserByName(username);
console.log(userFromDB);

if(userFromDB) {
    response.status(400).send({ message: "Username already exists" });
}else if (password.length < 8 ) {
    response.status(400).send({ message: "Password must be at least 8 characters" });
}else {
const hashedPassword = await generateHashedpassword(password);
const result = await createUser({
    username: username, 
    password: hashedPassword,
    roleId: 1,
});

    response.send(result);
}
});


// Login API-POST - Create
router.post("/login",  async function (request, response) {   
    const { username, password } = request.body;
//db.users.insertOne(data);

const userFromDB = await getUserByName(username);
console.log(userFromDB);

if(!userFromDB) {
    response.status(401).send({ message: "Invalid credentials" });
} else {
    const storedDBPassword = userFromDB.password;
    const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);
    console.log(isPasswordCheck);

    if(isPasswordCheck){
        const token = jwt.sign({ id: userFromDB._id}, process.env.SECRET_KEY);
        response.send({ message: "Successfull login", token: token, roleId: userFromDB.roleId, });
    } else {
        response.status(401).send({ message: "Invalid credentials"});
    }
}
});

export default router;