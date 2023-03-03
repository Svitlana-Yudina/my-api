import express from 'express';
import path from 'path';

const server = express();

server.use(express.static(path.resolve('public')));

server.get('/', (req, res) => {
  const filePath = path.resolve('public', 'index.html');

  res.sendFile(filePath);
});

server.listen(8080);
