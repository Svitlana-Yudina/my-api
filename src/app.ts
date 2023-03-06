/* eslint-disable max-len */
/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import pkg from 'pg';

const server = express();
const port = process.env.PORT || 8080;

const { Client } = pkg;
const client = new Client('postgres://qcewziyl:E4tFnzlQHFhd_aLwuFHfWGuH7fXPZGTk@trumpet.db.elephantsql.com/qcewziyl');

await client.connect();

// const result = await client.query(`
// select *
// from users
// `);

// console.log(result.rows);
server.use(express.static(path.resolve('public')));
server.use(express.json());

server.get('/main', (req, res) => {
  res.send('<h1>Main page</h1>');
});

server.get('/users', async(req, res) => {
  const result = await client.query(`
    select *
    from users
  `);

  res.send(result.rows);
});

server.post('/users', async(req, res) => {
  const {
    FirstName,
    BirthDate,
    email,
    password,
  } = req.body;
  const person = await client.query(`
    INSERT INTO public.users (
    "FirstName", "BirthDate", email, password
    ) VALUES (
    $1, $2, $3, $4)
    returning *`, [FirstName, BirthDate, email, password]);

  res.send(person.rows);
});

server.get('/about', (req, res) => {
  res.send('<h1>about page</h1>');
});

server.listen(port, () => {
  console.log('server start on port', port);
});
