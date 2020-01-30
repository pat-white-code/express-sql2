const express = require('express');
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let pool = mysql.createPool({
  connectionLimit : 100,
  host: '34.70.100.41',
  user: 'root',
  password: 'JoeBiden354',
  database: 'admin',
  debug: false
})

function get_users(req, res) {
  pool.query(`SELECT * FROM users`, (err, rows)=> {
    if(err) {
      return res.json({'Error': true, 'message': 'Error occured:' + err
    })}
    else {
      res.json(rows)
    }
  })
}

function get_first_names(req, res) {
  let sql = 'SELECT ??, ?? FROM ?? WHERE ?? < ?';
  const replacements = ['id', 'first_name', 'users', 'id', 10];
  sql = mysql.format(sql, replacements);
  pool.query(sql, (err, rows)=> {
    if(err) {
      return res.json({'Error': true, 'message': 'Error occured:' + err
    })} else {
      res.json(rows)
    }
  })
}

const createUser = (req, res) => {
  let sql = 'INSERT INTO users (first_name, last_name) VALUES (?, ?);';
  
  
  const replacements = [req.body.firstName, req.body.lastName];
  sql = mysql.format(sql, replacements);
  pool.query(sql, (err, rows)=> {
    if(err) {
      return res.json(err)
    } else {
      let select = 'SELECT * FROM users ORDER BY id DESC LIMIT 1';
      pool.query(select, (err, rows) => {
        if(err) {
          return res.json(err)
        } else {
          res.json(rows)
        }
      })
    }
  })
}


app.post('/users', createUser); 

app.get('/', get_users);

app.get('/first-names', get_first_names);

app.listen(port, ()=> {
  console.log(`listening on port ${port}`)
})