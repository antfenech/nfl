'use strict';
var _ = require('underscore');

module.exports = function() {
  return {
    restrict: 'A',
    scope: true,
    templateUrl: './../../build/html/templates/header.html',
    controller: ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
      (function() {
        var gameId = $routeParams.gameId;
        if (!gameId || isNaN(gameId)) return;

        $http({
          method: 'GET',
          url: '/api/game/' + gameId + '?scoreboard=true',
        }).success(function(data) {
          $scope.periods = data.scoreboard.periods;
          _.each(data.scoreboard.teams, function(team) { $scope[team.side] = team; });
        }).catch(function(err) {
          console.log('err', err);
        });

      })();
    }],
  };
};

