'use strict';
const express     = require('express');
const path        = require('path');
const bodyParser  = require('body-parser');
const compression = require('compression');
const app         = express();
const PORT        = 3000;

app.use(compression());

app.set('port', process.env.PORT || PORT);
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use('/', require('./server/routes.js'));

app.listen(PORT, () => { console.log('http://localhost:' + PORT); });
