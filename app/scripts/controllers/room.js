'use strict';

/**
 * @ngdoc function
 * @name vidConfApp.controller:RoomCtrl
 * @description
 * # RoomCtrl
 * Controller of the vidConfApp
 */

angular.module('vidConfApp')
  .controller('RoomCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

angular.module('publicApp')
  .controller('RoomCtrl', function ($sce, VideoStream, $location, $routeParams, $scope, Room) {
    if(!window.RTCPeerConnection || !navigator.getUserMedia) {
      $scope.error = "WebRTC is not supported by your browser";
      return;
    }

    var stream;

    VideoStream.get()
    .then(function(s) {
      stream = s;
      Room.init(stream);
      stream = URL.createObjectURL(stream);
      if(!$routeParams.roomId) {
        Room.createRoom()
        .then(function(roomId) {
          $location.path('/room' + roomId);
        });
      } else {
        Room.joinRoom($rootParams.rootId);
      }
    }, function() {
      $scope.error = "No audio and video permissions.";
    });
    $scope.peers = [];
    Room.on('peer.stream', function(peer) {
      console.log('Client connected, adding new stream');
      $scope.peers.push({
        id: peer.is,
        stream: URL.createObjectURL(peer.stream)
      });
    });
    Room.on('peer.disconnected', function(peer) {
      console.log("Clien disconnected, removing stream");
      $scope.peers = $scope.peers.filter(function(p) {
        return p.id !== peer.id;
      });
    });

    $scope.getLocalVideo = function() {
      return $sce.trustAsResourceUrl(stream);
    };
  });
