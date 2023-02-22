const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require("dotenv").config()

console.log('Database hostname:', process.env.DB_HOSTNAME);

const app = express();

app.use(bodyParser.json());

const conn = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME, /* MySQL User */
  password: process.env.DB_PASSWORD, /* MySQL Password */
  database: 'fruitcompany' /* MySQL Database */
});


conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected with App...');
});

function apiResponse(results){
    return JSON.stringify({"status": 200, "error": null, "response": results});
}

/**
 * paste the API endpoints code below
 */

//API endpoint to GET all fruits
app.get('/api/fruits',(req, res) => {
    let sqlQuery = "SELECT * FROM fruitcompany.fruits;";
   let query = conn.query(sqlQuery, (err, results) => {
        if(err) throw err;
        res.setHeader('Content-Type', 'application/json'); 
        res.status(200);
        res.send(apiResponse(results)); 
    }); 
});

//API endpoint to GET details of a fruit
app.get('/api/fruits/:name',(req, res) => {
    let sqlQuery = "SELECT * FROM fruitcompany.fruits WHERE name='" + req.params.name+"'";
    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.setHeader('Content-Type', 'application/json'); 
      res.status(200);
      res.send(apiResponse(results));
    });
  });

//API endpoint to ADD a new fruit
app.post('/api/fruits',(req, res) => {
    let sqlQuery = `INSERT INTO fruitcompany.fruits VALUES ('${req.body.name}', '${req.body.quantity}', '${req.body.price}');`;
    let query = conn.query(sqlQuery,(err, results) => {
      if(err) throw err;
      res.setHeader('Content-Type', 'application/json'); 
      res.status(201);
      res.send(apiResponse({'name': req.body.name, 'quantity': req.body.quantity, 'price': req.body.price}));
    });
  });

//API endpoint to UPDATE an existing fruit
  app.put('/api/fruits/:name',(req, res) => {
    let sqlQuery = "UPDATE fruitcompany.fruits SET quantity='"+req.body.quantity+"', price='"+req.body.price+"' WHERE name='"+req.params.name+"'";
    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.setHeader('Content-Type', 'application/json'); 
      res.status(201);
      res.send(apiResponse({'name': req.params.name, 'quantity': req.body.quantity, 'price': req.body.price}));
    });
  });
  
//API endpoint to delete a fruit
  app.delete('/api/fruits/:name',(req, res) => {
    let sqlQuery = "DELETE FROM fruitcompany.fruits WHERE name='"+req.params.name+"'";
    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.setHeader('Content-Type', 'application/json'); 
      res.status(200);
      res.send(apiResponse({"msg": "Fruit deleted"}));
    });
  });

app.listen(3000,() =>{
    console.log('Server started on port 3000...');
  });