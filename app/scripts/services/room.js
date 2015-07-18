'use strict';

/**
 * @ngdoc service
 * @name vidConfApp.Room
 * @description
 * # Room
 * Factory in the vidConfApp.
 */
angular.module('vidConfApp')
  .factory('Room', function ($rootScope, $q, Io, config) {
    var iceConfig = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302'}]},
      peerConnections = {},
      currentId, roomId, stream;

    function getPeerConnection(id) {
      
    }

  });
