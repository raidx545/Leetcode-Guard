require("dotenv").config();
const path = require('path');
const express = require('express');




const app = express();

app.use(express.urlencoded({ extended: true }));


module.exports = app;
