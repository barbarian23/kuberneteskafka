const express = require('express');
const app = express();
const port = 3224;

const swaggerUI = require("swagger-ui-express");
const APIDocument = require("./API.json");

app.use('/', swaggerUI.serveFiles(APIDocument, {}), swaggerUI.setup(APIDocument));

app.listen(port, function(){
    console.log(`Swagger app listening on port http://localhost:${port}`);
});