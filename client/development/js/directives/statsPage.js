'use strict';

module.exports = function() {
  return {
    scope: true,
    templateUrl: './../../build/html/templates/statsPage.html',
    controller: ['$scope', '$routeParams', function($scope, $routeParams) {

      var icons = {
        team: 'fa-users',
        pos:  'fa-user',
        play: 'fa-tasks',
      };

      $scope.gameId = $routeParams.gameId;
      $scope.content = 'Team Stats';
      $scope.icon = icons.team;

      $scope.setContent = function(string, icon) {
        $scope.content = string;
        $scope.icon = icons[icon];
      };
    }],
  };
};
