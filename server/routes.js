'use strict';
module.exports = (() => {

  const Controller = require('./controller.js');

  let generalRoutes = require('express').Router();

  generalRoutes.route('/')
    .get((req, res) => { res.render('index.html'); });

  generalRoutes.route('/api/game/:gameId')
    .get((req, res) => { Controller.gameStats(req, res); });

  return generalRoutes;
})();
