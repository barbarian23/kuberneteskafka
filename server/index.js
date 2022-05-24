import '@babel/polyfill';
const express = require('express');
const http = require('http');
const app = express();
const port = 3000;
const router = require('./router.server');
const path = require('path');

app.use("/static", express.static(path.resolve(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router(app);

app.set('port', 3000);

const server = http.createServer(app);

server.listen(app.get('port'), () => console.log(`Example app listening on http://localhost:${port}`));