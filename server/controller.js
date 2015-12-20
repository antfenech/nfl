'use strict';
const Model = require('./model.js');
const Async = require('async'); //not needed used to show db calls

function gameStats(req, res) {

  const gameId  = req.params.gameId;
  const queries = req.query;

  if (!gameId || isNaN(gameId) || Object.keys(queries).length === 0)
    return res.status(400).json('Missing Paramters').end();

  let func = {
    stats:      'getStats',
    location:   'getLocation',
    scoreboard: 'getScoreboard',
    playByPlay: 'getPlayByPlay',
  };

  let response = {};

  //using Async instead of underscore _.each to show how I would do if it were
  //database calls instead of a JSON file.
  Async.each(Object.keys(queries), (query, next) => {

    if (func[query]) response[query] = Model[func[query]](gameId);
    next(/*callback error argument*/);
  }, (err) => {
    res.status(err ? 400 : 200).json(err ? 'Server Error' : response).end();
  });
}

module.exports = {
  gameStats,
};
