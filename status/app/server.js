const express = require('express');
 
const cors = require('cors');
const morgan = require('morgan');
 
const app = express();
 
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
 
app.use(express.json());
 
app.use(morgan('dev'));
 
module.exports = app;