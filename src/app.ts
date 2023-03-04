import express from 'express';
// import path from 'path';

const server = express();
const PORT = process.env.PORT || 8080;

// server.use(express.static(path.resolve('dist')));

server.get('/', (req, res) => {
  // const filePath = path.resolve('dist', 'index.html');

  // res.sendFile(filePath);
  res.send('<h1>Main page</h1>');
});

server.get('/about', (req, res) => {
  res.send('<h1>Hello!</h1>');
});

server.listen(PORT);
