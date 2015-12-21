'use strict';
const express     = require('express');
const path        = require('path');
const bodyParser  = require('body-parser');
const compression = require('compression');
const app         = express();
const PORT        = app.listen(process.env.PORT || 5000);
app.use(compression());
app.set('port', process.env.PORT || PORT);
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use('/', require('./server/routes.js'));

app.listen(PORT, () => { console.log('http://localhost:5000'); });
