'use strict';
var _ = require('underscore');

module.exports = function() {
  return {
    restrict: 'A',
    scope: true,
    templateUrl: './../../build/html/templates/playByPlay.html',
    controller: ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
      (function() {
        var gameId = $routeParams.gameId;
        if (!gameId || isNaN(gameId)) return;

        $http({
          method: 'GET',
          url: '/api/game/' + gameId + '?playByPlay=true',
        }).success(function(data) {
          var events = data.playByPlay;
          $scope.periods = {num: events.periods, range: _.range(data.playByPlay.periods)};
          $scope.state = {selected: events.periods};
          $scope.plays = events.plays;
        }).catch(function(err) {
          console.log('err', err);
        });

        $scope.setPeriod = function(n) {
          $scope.state.selected = n;
        };
      })();
    }],
  };
};
