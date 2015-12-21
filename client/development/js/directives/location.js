'use strict';

module.exports = function() {
  return {
    restrict: 'A',
    scope: true,
    templateUrl: './../../build/html/templates/location.html',
    controller: ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
      (function() {
        var gameId = $routeParams.gameId;
        if (!gameId || isNaN(gameId)) return;

        $http({
          method: 'GET',
          url: '/api/game/' + gameId + '?location=true',
        }).success(function(data) {
          $scope.location = data.location;
        }).catch(function(err) {
          console.log('err', err);
        });
      })();
    }],
  };
};