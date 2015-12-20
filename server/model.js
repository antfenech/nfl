'use strict';
const _ = require('underscore');
const FILE = [require('./super-bowl-play-by-play.json')];

//used to simulate searching DB by reference
//similar to the where clause in each db call
function getGame(gameId) { return _.findWhere(FILE, {reference: gameId}); }

function getAvg(total, sum) { return parseFloat((total / sum).toFixed(1)); }

function getQBR(interceptions, attempts) {
  return parseFloat((((0.095 - interceptions) / attempts) / 0.04 * -100).toFixed(1));
}

function getLocation(gameId) {
  function _getWeather(string) {
    let weather = {};

    _.each(string.split(','), (stat, index) => {
      let pair = stat.split(':');

      if (index === 0) {
        let condition = pair[0].split(' ');
        weather.cast = condition[0].trim();
        pair[0] = condition[1].trim();
      }

      weather[pair[0].trim().toLowerCase()] = pair[1].trim();
    });

    return weather;
  }

  const game = getGame(gameId);
  if (!game) return 'Game Not Found'; // used to simulate where gameId is in schema

  let summary = game.summary;
  let venue   = summary.venue;

  return {
    stadium: venue.name,
    city: venue.city,
    state: venue.state,
    weather: _getWeather(game.weather),
    occupancy: {
      attendance: game.attendance,
      capacity: venue.capacity,
      percent: parseFloat((game.attendance / venue.capacity) * 100).toFixed(0) + '%',
    },
  };
}

function getScoreboard(gameId) {
  function _addPeriodScores(teams, period, score) {
    _.each(_.keys(teams), (team) => {
      let side = teams[team].side;
      teams[team].period[period] = score[side].points;
    });
  }

  const game = getGame(gameId);
  if (!game) return 'Game Not Found'; // used to simulate where gameId is in schema

  let periods = [];
  let teams = {
    [game.summary.home.reference]: {side: 'home'},
    [game.summary.away.reference]: {side: 'away'},
  };

  _.each(_.keys(teams), (team) => {
    let side = teams[team].side;
    teams[team].name   = game.summary[side].name;
    teams[team].alias  = game.summary[side].alias;
    teams[team].period = {};
    teams[team].final  = game.summary[side].points;
  });

  _.each(game.periods, (period) => {
    periods.push(period);
    _addPeriodScores(teams, period.number, period.scoring);
  });

  return {periods, teams};
}

function getPlayByPlay(gameId) {

  const game = getGame(gameId);
  if (!game) return 'Game Not Found'; // used to simulate where gameId is in schema

  let periods = game.periods.length;
  let plays   = {};

  _.each(game.periods, (period) => {
    let periodNum = period.number;

    _.each(period.pbp, (playObj) => {
      if (playObj.type !== 'drive') return;
      _.each(playObj.events, (event) => {
        if (event.hasOwnProperty('alt_description')) {
          plays[event.reference] = {
            period: periodNum,
            time: event.clock,
            play: event.alt_description,
            type: event.play_type,
          };
        }
      });
    });
  });
  return {periods, plays};
}

function getStats(gameId) {

  function _setTeams(summary) {
    let teams = {
      [summary.home.reference]: {side: 'home'},
      [summary.away.reference]: {side: 'away'},
    };

    _.each(_.keys(teams), (team) => {
      let side = teams[team].side;
      teams[team].name      = summary[side].name;
      teams[team].alias     = summary[side].alias;
      teams[team].reference = summary[side].reference;
      teams[team].stats     = {
        penalties: {yards: 0, total: 0},
        rushing:   {yards: 0, targets: 0, touchdowns: 0},
        receiving: {yards: 0, targets: 0, completions: 0, touchdowns: 0},
        passing:   {yards: 0, targets: 0, completions: 0, sacks: 0, interceptions: 0, touchdowns: 0},
        defense:   {tackles: 0, blockedPasses: 0, sacks: 0, qbHit: 0, interceptions: 0},
      };
    });
    return teams;
  }

  function _checkPlayer(stat) {
    if (!stat.hasOwnProperty('player')) return;
    let playerReference = stat.player.reference;

    if (players.hasOwnProperty(playerReference)) return;
    let player = stat.player;
    players[playerReference] = {
      name: player.name,
      reference: playerReference,
      jersey: Number(player.jersey),
      team: {
        name: teams[stat.teamReference].name,
        alias: teams[stat.teamReference].alias,
        reference: stat.teamReference,
      },
      position: player.position,
      penalties: {
        yards: 0,
        total: 0,
      },
      rushing: {
        yards: 0,
        targets: 0,
        touchdowns: 0,
        redZoneAttempt: 0,
      },
      receiving: {
        yards: 0,
        targets: 0,
        receptions: 0,
        touchdowns: 0,
        redZoneAttempt: 0,
      },
      passing: {
        yards: 0,
        targets: 0,
        completions: 0,

        sacks: 0,
        lostYards: 0,
        interceptions: 0,
        attemptedYards: 0,

        touchdowns: 0,
        redZoneAttempt: 0,
      },
      defense: {
        blockedPasses: 0,
        interceptions: 0,
        sacks: 0,
        tackles: {
          total: 0,
          assisted: 0,
          primary: 0,
          qbHit: 0,
        },
      },
    };
  }

  function _addRushingStats(stat) {
    let teamCategory   = teams[stat.teamReference].stats.rushing;
    let playerCategory = players[stat.playerReference].rushing;
    if (!stat.nullified) {
      let yards          = stat.yards || 0;
      let isTouchDown    = stat.touchdown || 0;

      teamCategory.yards      += yards;
      teamCategory.targets    += 1;
      teamCategory.touchdowns += isTouchDown;

      playerCategory.yards   += yards;
      playerCategory.targets += 1;
      playerCategory.redZoneAttempt += stat.inside_20 || 0;
      playerCategory.touchdowns     += isTouchDown;
    }
  }

  function _addReceiveingStats(stat) {
    let teamCategory    = teams[stat.teamReference].stats.receiving;
    let playerCategory  = players[stat.playerReference].receiving;
    if (!stat.nullified) {

      let yards           = stat.yards || 0;
      let isComplete      = !!stat.reception ? 1 : 0;
      let isTouchDown     = stat.touchdown || 0;

      teamCategory.yards += yards;
      teamCategory.targets += 1;
      teamCategory.touchdowns += isTouchDown;
      teamCategory.completions += isComplete;

      playerCategory.receptions += isComplete;
      playerCategory.yards += yards;
      playerCategory.targets += 1;
      playerCategory.touchdowns += isTouchDown;
      playerCategory.redZoneAttempt += stat.inside_20 || 0;
    }
  }

  function _addPassingStats(stat) {
    let teamCategory    = teams[stat.teamReference].stats.passing;
    let playerCategory  = players[stat.playerReference].passing;

    if (!stat.nullified) {
      let yards           = stat.yards || 0;
      let yardsAttempted  = stat.att_yards || 0;
      let lostYards       = stat.sack_yards || 0;
      let isComplete      = stat.complete || 0;
      let isInterception  = stat.interception || 0;
      let isSack          = stat.sack || 0;
      let isTouchDown     = stat.touchdown || 0;

      teamCategory.yards += yards;
      teamCategory.targets += 1;
      teamCategory.completions += isComplete;
      teamCategory.sacks += isSack;
      teamCategory.touchdowns += isTouchDown;
      teamCategory.interceptions += isInterception;

      playerCategory.yards += yards;
      playerCategory.targets += 1;
      playerCategory.completions += isComplete;
      playerCategory.redZoneAttempt += stat.inside_20 || 0;
      playerCategory.interceptions += isInterception;
      playerCategory.sacks += isSack;
      playerCategory.attemptedYards += yardsAttempted;
      playerCategory.touchdowns += isTouchDown;
      playerCategory.lostYards += lostYards;
    }
  }

  function _addPenalty(stat) {
    let teamCategory    = teams[stat.teamReference].stats.penalties;

    teamCategory.total  += stat.penalty;
    teamCategory.yards  += stat.yards;

    if (stat.hasOwnProperty('playerReference')) {
      let playerCategory    = players[stat.playerReference].penalties;
      playerCategory.total += stat.penalty;
      playerCategory.yards += stat.yards;
    }
  }

  function _addDefense(stat) {
    let teamCategory    = teams[stat.teamReference].stats.defense;
    let playerCategory   = players[stat.playerReference].defense;
    if (!stat.nullified) {

      let blockedPasses   = stat.pass_defended || 0;
      let tackle          = stat.tackle || 0;
      let assistedTackle  = stat.ast_tackle || 0;
      let primaryTackle   = stat.primary || 0;
      let isSack          = stat.sack || 0;
      let qbHit           = stat.qb_hit || 0;
      let isInterception  = stat.interception || 0;

      teamCategory.blockedPasses  += blockedPasses;
      teamCategory.tackles += tackle;
      teamCategory.sacks += isSack;
      teamCategory.qbHit += qbHit;
      teamCategory.interceptions += isInterception;

      playerCategory.sacks += isSack;
      playerCategory.blockedPasses += blockedPasses;
      playerCategory.tackles.total += tackle;
      playerCategory.tackles.qbHit += qbHit;
      playerCategory.tackles.assisted += assistedTackle;
      playerCategory.tackles.primary  += primaryTackle;
      playerCategory.interceptions += isInterception;
    }
  }

  const game = getGame(gameId);
  if (!game) return 'Game Not Found'; // used to simulate where gameId is in schema

  let players = {};

  let addStat = {
    rush: _addRushingStats,
    receive: _addReceiveingStats,
    pass: _addPassingStats,
    penalty: _addPenalty,
    defense: _addDefense,
  };

  let teams = _setTeams(game.summary);

  _.each(game.periods, (period) => {
    let periodNum = period.number;

    _.each(period.pbp, (playObj) => {
      if (playObj.type !== 'drive') return;
      _.each(playObj.events, (event) => {
        if (event.hasOwnProperty('statistics')) {
          _.each(event.statistics, (stat) => {
            if (stat.hasOwnProperty('team'))   stat.teamReference   = stat.team.reference;
            if (stat.hasOwnProperty('player')) stat.playerReference = stat.player.reference;

            _checkPlayer(stat);
            if (addStat[stat.stat_type]) addStat[stat.stat_type](stat);
          });
        }
      });
    });
  });

  _.each(players, (p) => {
    p.passing.avg = p.passing.targets > 0 ? getAvg(p.passing.yards, p.passing.targets) : 0;
    p.passing.qbr = p.passing.targets > 0 ? getQBR(p.passing.interceptions, p.passing.targets) : 0;
    p.rushing.avg = p.rushing.targets > 0 ? getAvg(p.rushing.yards, p.rushing.targets) : 0;
    p.receiving.avg = p.receiving.targets > 0 ? getAvg(p.receiving.yards, p.receiving.targets) : 0;
  });

  _.each(teams, (team) => {
    let t = team.stats;
    t.passing.avg   = t.passing.completions > 0 ? getAvg(t.passing.yards, t.passing.completions) : 0;
    t.rushing.avg   = t.rushing.targets   > 0 ? getAvg(t.rushing.yards, t.rushing.targets) : 0;
    t.receiving.avg = t.receiving.targets > 0 ? getAvg(t.receiving.yards, t.receiving.targets) : 0;
    t.penalties.avg = t.penalties.total   > 0 ? getAvg(t.penalties.yards, t.penalties.total)   : 0;
  });

  return {teams, players};
}

module.exports = {
  getLocation,
  getScoreboard,
  getPlayByPlay,
  getStats,
};
