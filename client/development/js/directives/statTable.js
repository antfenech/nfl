'use strict';

module.exports = function() {
  return {
    restrict: 'A',
    scope: {
      collection: '=',
    },
    requrie: '^collection',
    templateUrl: './../../build/html/templates/statsTable.html',
    controller: ['$scope', function($scope) {
      $scope.changeSorting = function(i, chart) {
        if ($scope.collection.sort.stat === $scope.collection.stat[i]) {
          $scope.collection.sort.desc = !$scope.collection.sort.desc;
        } else {
          $scope.collection.sort.desc = true;
          $scope.collection.sort.stat = $scope.collection.stat[i];
          $scope.collection.sort.col  = $scope.collection.columns[i];
        }
      };
    }],
  };
};
