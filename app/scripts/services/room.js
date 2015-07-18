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
      if (peerConnections[id]) {
        return peerConnections[id];
      }
      var pc = new RTCPeerConnection(iceConfig);
      peerConnections[id] = pc;
      pc.addStream(stream);
      pc.oniceandidate = function(evnt) {
        socket.emit('msg', { by: currentId, to: id, ice: evnt.candidate, type: 'ice' });
      };
      pc.onaddstream = function(evnt) {
        console.log("Received new stream");
        api.trigger('peer.stream', [{
          id: id,
          stream: evnt.stream
        }]);
        if (!$rootScope.$$digest) {
          $rootScope.$apply();
        }
      };
      return pc;
    }

    function makeOffer(id) {
      var pc = getPeerConnection(id);
      pc.createOffer(function(sdp) {
        pc.setLocalDescription(sdp);
        console.log("Creating an offer for", id);
        socket.emit('msg', { by: currentId, to: id, sdp: sdp, type: 'sdp-offer'});
      }, function(e) {
        console.log(e);
      },
    { mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }});
    }

    function handleMessage(data) {
      var pc = getPeerConnection(data.by);
      switch (data.type) {
        case 'sdp-offer':
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function() {

          })
      }
    }

  });
