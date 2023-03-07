/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import pkg from 'pg';
import cors from 'cors';

const server = express();
const port = process.env.PORT || 8080;
const { Client } = pkg;
const client = new Client('postgres://qcewziyl:E4tFnzlQHFhd_aLwuFHfWGuH7fXPZGTk@trumpet.db.elephantsql.com/qcewziyl');

await client.connect();

server.use(cors());
server.use(express.static(path.resolve('public')));
server.use(express.json());

server.get('/users', async(req, res) => {
  try {
    const usersToSend = await client.query(`
      SELECT id, name, birth, email
      FROM users
    `);
    const usersLength = usersToSend.rows.length;

    res.setHeader('Content-Length', usersLength);
    res.send(usersToSend.rows);
  } catch (err) {
    res.send('Something went wrong:( We will fix this problem soon');
  }
});

server.get('/users/:userId', async(req, res) => {
  try {
    const { userId } = req.params;
    const foundUser = await client.query(`
      SELECT id, name, birth, email
      FROM users
      WHERE id = $1
    `, [Number(userId)]);

    if (foundUser.rows.length !== 0) {
      res.send(foundUser.rows);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.send('Something went wrong:( We will fix this problem soon');
  }
});

server.post('/users', async(req, res) => {
  try {
    const {
      name,
      birth,
      email,
      password,
    } = req.body;

    if (!name || !birth || !email || !password) {
      res.sendStatus(422);

      return;
    }

    const person = await client.query(`
      INSERT INTO public.users (
      name, birth, email, password
      ) VALUES (
      $1, $2, $3, $4)
      returning *`, [name, birth, email, password]);

    res.statusCode = 201;
    res.send(person.rows);
  } catch (err) {
    res.send('Something went wrong:( We will fix this problem soon');
  }
});

// server.put('/users/:userId', (req, res) => {

// });

server.delete('/users/:userId', async(req, res) => {
  try {
    const { userId } = req.params;
    const foundUser = await client.query(`
      DELETE
      FROM users
      WHERE id = $1
      RETURNING *
    `, [Number(userId)]);

    if (foundUser.rows.length !== 0) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.send('Something went wrong:( We will fix this problem soon');
  }
});

// server.get('/main', (req, res) => {
//   res.send('<h1>Main page</h1>');
// });

// server.get('/users', async(req, res) => {
//   const result = await client.query(`
//     select *
//     from users
//   `);

//   res.send(result.rows);
// });

// server.post('/users', async(req, res) => {
//   const {
//     FirstName,
//     BirthDate,
//     email,
//     password,
//   } = req.body;
//   const person = await client.query(`
//     INSERT INTO public.users (
//     "FirstName", "BirthDate", email, password
//     ) VALUES (
//     $1, $2, $3, $4)
//     returning *`, [FirstName, BirthDate, email, password]);

//   res.send(person.rows);
// });

// server.get('/about', (req, res) => {
//   res.send('<h1>about page</h1>');
// });

server.listen(port, () => {
  console.log('server start on port', port);
});
