'use strict';
var angular        = require('angular');
var angularRoute   = require('angular-route');

var app = angular.module('myApp', [
  angularRoute,
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider.when('/', {
    redirectTo: '/game/56502',
  }).when('/game/:gameId', {
    templateUrl: 'development/html/index.html',
  }).otherwise({
    redirectTo: '/',
  });

  // if (window.history && window.history.pushState) {
  //   $locationProvider.html5Mode(true);
  // }
}]);

app.directive('ngStatsPage', require('./directives/statsPage'));
app.directive('ngHeader', require('./directives/header.js'));
app.directive('ngLocation', require('./directives/location.js'));
app.directive('ngPlayByPlay', require('./directives/playByPlay.js'));
app.directive('ngStats', require('./directives/stats.js'));
app.directive('ngStatTable', require('./directives/statTable.js'));
