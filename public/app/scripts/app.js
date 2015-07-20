'use strict';

/**
 * @ngdoc overview
 * @name publicApp
 * @description
 * # publicApp
 *
 * Main module of the application.
 */
angular
  .module('publicApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl',
      })
      .when('/room', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl',
      })
      .otherwise({
        redirectTo: '/room'
      });
  })
  .constant('config'), {
     SIGNALING_SERVER_URL: "http://arta.herokuapp.com";
  });
