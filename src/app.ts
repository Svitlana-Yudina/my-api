/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import pkg from 'pg';

const server = express();
const port = process.env.PORT || 8080;

const { Client } = pkg;
const client = new Client({
  host: 'localhost',
  user: 'postgres', // owner
  password: 'test123',
  database: 'test_db', // name of DB
});

// const client = new Client({
//   host: 'test-app-ydno.onrender.com',
//   user: 'postgres', // owner
//   password: 'test123',
//   database: 'test_db', // name of DB
// });

await client.connect();

const result = await client.query(`
select *
from users
`);

// console.log(result.rows);

server.use(express.static(path.resolve('public')));

server.get('/main', (req, res) => {
  res.send('<h1>Main page</h1>');
});

server.get('/users', (req, res) => {
  res.send(result.rows);
});

server.get('/about', (req, res) => {
  res.send('<h1>about page</h1>');
});

server.listen(port, () => {
  console.log('server start on port', port);
});
