'use strict';

/**
 * @ngdoc overview
 * @name vidConfApp
 * @description
 * # vidConfApp
 *
 * Main module of the application.
 */
angular
  .module('vidConfApp', [
    'ngAnimate',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/room/:roomId', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl'
      })
      .when('/room', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl'
      })
      .otherwise({
        redirectTo: '/room'
      });
  });

  angular.module('publicApp')
    .constant('config', {
        SIGNALING_SERVER_URL: "https://arta.herokuapp.com/"
    });
