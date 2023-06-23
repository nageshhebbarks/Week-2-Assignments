/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with email, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the email already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstName, lastName and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstName, lastName and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstName/lastName.
    The users email and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser');
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.use(bodyParser.json());

let users = []
let nextUserId = 1

app.post("/signup", (req, res) => {
  let newUser = req.body // validate the input.

  let existingUser = users.filter((elem) => elem.email === newUser.email)
  if(users.length > 0 && existingUser.length == 0) {
    res.status(400).send("user already exists");
    return
  }

  let user = { id : nextUserId++, email : newUser.email, password : newUser.password, 
                firstName : newUser.firstName, lastName : newUser.lastName }

  users.push(user)
  res.status(201).send("Signup successful")
})

app.post("/login", (req, res) => {
  let loginUser = req.body // validate the input.

  if(users.length == 0) {
    res.status(401).send("unauthorized")
    return    
  }
  let existingUserList = users.filter((elem) => elem.email == loginUser.email)

  if(existingUserList.length == 0 || existingUserList[0].password != loginUser.password) {
    res.status(401).send("unauthorized")
    return
  }
  
  let existingUser = existingUserList.pop()

  let authToken = { email : existingUser.email,  
                firstName : existingUser.firstName, lastName : existingUser.lastName, authToken: "token" }

  res.status(200).json(authToken)
})

app.get("/data", (req, res) => {

  let existingUserList = users.filter((elem) => elem.email == req.headers.email)
  if(existingUserList.length == 0 || existingUserList.pop().password != req.headers.password) {
    res.status(401).send("Unauthorized")
    return
  }

  res.status(200).json({ users : users})

})

// app.listen(PORT, () => {console.log("listening")})

module.exports = app;
