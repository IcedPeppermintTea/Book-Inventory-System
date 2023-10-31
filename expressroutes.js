const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(__dirname));

var mysql = require('mysql2');

// Create connection to mySQL database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "21!23Lae",
    database: "Read_System"
  });

var url = require('url');

// Use this section to test bringing up initial webpage

app.get('/', (routeRequest, routeResult) => {
  routeResult.sendFile(path.join(__dirname, '/sign_up.html'))
});


app.post('/Users', (routeRequest, routeResult)=> {
  console.log("inside of POST function")

  let User = routeRequest.body
  let Username = User.Username
  let FirstName = User.FirstName
  let LastName = User.LastName
  let Password = User.Password
  let Summary = User.Summary
  let ProfilePictureURL = User.ProfilePictureURL
  let UserType = User.UserType

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    console.log(FirstName, LastName, Username, Password);

    var sqlQuery = `INSERT INTO Users (FirstName, LastName, Username, Password) VALUES ("${FirstName}", "${LastName}", "${Username}", "${Password}")`;
    connection.query(sqlQuery, function (err, queryResult) {
      if (err) throw err;
      console.log("1 record inserted, ID:" + queryResult.insertId);
      routeResult.json({
        message: 'Inserted record ' + queryResult.insertId
      });
    });
  });
})

app.get('/Users/:id', (routeRequest, routeResult) => {
  var id = routeRequest.params.id

  console.log("inside of read function")
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    var sqlQuery = `SELECT * FROM Users WHERE ID ="${id}"`;
    console.log(sqlQuery);

    connection.query(sqlQuery, function (err, queryResult, fields) {
      if (err) throw err;
      console.log("1 record read: " + queryResult[0].FirstName + " " + queryResult[0].LastName + " " + queryResult[0].Username);
      routeResult.json({
        message: 'Retrieved record ' + queryResult[0].FirstName + " " + queryResult[0].LastName
      });
    });
  });
});

// New login API endpoint
app.post('/login', (req, res) => {
  const {Username, Password} = req.body;

  // Query database to check if the user exists
  const sqlQuery = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
  connection.query(sqlQuery, [Username, Password], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({message: "Server error found"});
      return;
    }

    if (results.length > 0) {
      // User found, provide access or return a success response
      res.status(200).json({message: "Login was successful!"});
    }
    else {
      // User not found, return an error response
      res.status(401).json({message: "Invalid username or password"});
    }
  });
});

// Activiate the server
app.listen(2020, () => {
    console.log('server is listening on port 2020');
});