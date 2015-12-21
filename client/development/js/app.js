'use strict';
var angular        = require('angular');
var angularRoute   = require('angular-route');
var directives     = require('./directives.js');

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

app.directive('ngHeader', directives.header);
app.directive('ngLocation', directives.location);
app.directive('ngPlayByPlay', directives.playByPlay);
app.directive('ngStats', directives.stats);
app.directive('ngStatTable', directives.table);