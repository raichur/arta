"use strict";angular.module("publicApp",["ngRoute"]).config(["$routeProvider",function(a){a.when("/room/:roomId",{templateUrl:"views/room.html",controller:"RoomCtrl"}).when("/room",{templateUrl:"views/room.html",controller:"RoomCtrl"}).otherwise({redirectTo:"/room"})}]),angular.module("publicApp").constant("config",{SIGNALING_SERVER_URL:void 0}),angular.module("publicApp").controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("publicApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("publicApp").factory("VideoStream",["$q",function(a){var b;return{get:function(){if(b)return a.when(b);var c=a.defer();return navigator.getUserMedia({video:!0,audio:!0},function(a){b=a,c.resolve(b)},function(a){c.reject(a)}),c.promise}}}]);