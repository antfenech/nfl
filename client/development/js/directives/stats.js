'use strict';
var _ = require('underscore');

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      show: '=',
    },
    templateUrl: './../../build/html/templates/stats.html',
    controller: ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
      (function() {
        var gameId = $routeParams.gameId;
        if (!gameId || isNaN(gameId)) return;

        $http({
          method: 'GET',
          url: '/api/game/' + gameId + '?stats=true',
        }).success(function(data) {

          $scope.table = {};
          $scope.table.passing = {
            title:   'INDIVIDUAL PASSING',
            columns: ['', 'TEAM', 'COM', 'ATT', 'YDS', 'AVG', 'TD', 'INT', 'SACKS', 'QBR'],
            set:     [],
            stat:    ['name', 'alias', 'completions', 'targets', 'yards', 'avg', 'touchdowns', 'interceptions', 'sacks', 'qbr'],
            sort:     {col: 'YDS', stat: 'yards', desc: true},
          };

          $scope.table.rushing = {
            title:   'INDIVIDUAL RUSHING',
            columns: ['', 'TEAM', 'RUSH', 'YDS', 'AVG', 'TD'],
            set:     [],
            stat:    ['name', 'alias', 'targets', 'yards', 'avg', 'touchdowns'],
            sort:    {col: 'YDS', stat: 'yards', desc: true},
          };

          $scope.table.receiving = {
            title:   'INDIVIDUAL RECEIVING',
            columns: ['', 'TEAM', 'REC', 'TGT', 'YDS', 'AVG', 'TD'],
            set:     [],
            stat:    ['name', 'alias', 'receptions', 'targets', 'yards', 'avg', 'touchdowns'],
            sort:    {col: 'YDS', stat: 'yards', desc: true},
          };

          $scope.table.teamPassing = {
            title:   'PASSING / RECIEVING',
            columns: ['', 'COM', 'ATT', 'YDS', 'AVG', 'TD', 'INT'],
            set:     [],
            stat:    ['name', 'completions', 'targets', 'yards', 'avg', 'touchdowns', 'interceptions'],
            sort:    {col: 'YDS', stat: 'yards', desc: true},
          };

          $scope.table.teamRushing = {
            title:  'RUSHING',
            columns: ['', 'CAR', 'YDS', 'AVG', 'TD'],
            set:     [],
            stat:    ['name', 'targets', 'yards', 'avg', 'touchdowns'],
            sort:    {col: 'YDS', stat: 'yards', desc: true},
          };

          $scope.table.teamDefense = {
            title:  'DEFENSE',
            columns: ['', 'PD', 'QB HTS', 'INT', 'SACK', 'TOT'],
            set:     [],
            stat:    ['name', 'blockedPasses', 'qbHit', 'interceptions', 'sacks', 'tackles'],
            sort:    {col: 'TOT', stat: 'tackles', desc: true},
          };

          $scope.table.teamPenalities = {
            title:  'PENALTIES',
            columns: ['', 'TOTAL', 'YARDS', 'AVG'],
            set:     [],
            stat:    ['name', 'total', 'yards', 'avg'],
            sort:    {col: 'YARDS', stat: 'yards', desc: true},
          };

          _.each(data.stats.players, function(player) {
            if (Number(player.passing.targets) > 0)   $scope.table.passing.set.push(_.extend(player.passing, {name: player.name, alias: player.team.alias}));
            if (Number(player.rushing.targets) > 0)   $scope.table.rushing.set.push(_.extend(player.rushing, {name: player.name, alias: player.team.alias}));
            if (Number(player.receiving.targets) > 0) $scope.table.receiving.set.push(_.extend(player.receiving, {name: player.name, alias: player.team.alias}));
          });

          _.each(data.stats.teams, function(team) {
            $scope.table.teamPassing.set.push(_.extend(team.stats.passing, {name: team.name}));
            $scope.table.teamRushing.set.push(_.extend(team.stats.rushing, {name: team.name}));
            $scope.table.teamDefense.set.push(_.extend(team.stats.defense, {name: team.name}));
            $scope.table.teamPenalities.set.push(_.extend(team.stats.penalties, {name: team.name}));
          });

        }).catch(function(err) {
          console.log('err', err);
        });
      })();
    }],
  };
};
