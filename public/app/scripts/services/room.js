'use strict';

/**
 * @ngdoc service
 * @name publicApp.Room
 * @description
 * # Room
 * Factory in the publicApp.
 */
angular.module('publicApp')
  .factory('Room', function ($rootScope, $q, Io, config) {

    var iceConfig = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]},
        peerConnections = {},
        currentId, roomId, stream;

    function getPeerConnection (id) {
      if (peerConnections[id]) {
        return peerConnections[id];
      }
      var pc = new RTCPeerConnection(iceConfig);
      peerConnections[id] = pc;
      pc.addStream(stream);
      pc.onicecandidate = function (iceevent) {
        socket.emit('msg', { by: currentId, to: id, ice: iceevent.candidate, type: 'ice' });
      };
      pc.onaddstream = function (iceevent) {
        console.log("Received new stream");
        api.trigger('peer.stream', [{
          id: id,
          stream: iceevent.stream
        }]);
        if (!$rootScope.$$digest) {
          $rootScope.$apply();
        }
      };
      return pc;
    }
    // Initiating new offer
    function makeOffer (id) {
      var pc = getPeerConnection(id);
      pc.createOffer(function (sdp) {
        pc.setLocalDescription(sdp);
        console.log("Creating an offer for", id);
        // Fired socket.io event to send new SDP offer
        socket.emit('msg', { by: currentId, to: id, sdp: sdp, type: 'sdp-offer' });
      }, function (e) {
        console.log(e);
      },
        { mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }});
    }

    // Handles the message based on the three types: sdp-offer, sdp-answer, and ice
    function handleMessage (data) {
      var pc = getPeerConnection(data.by);
      switch (data.type) {
        case 'sdp-offer':
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
            console.log("Setting remote description by offer");
            pc.createAnswer(function (sdp) {
              pc.setLocalDescription(sdp);
              socket.emit('msg', { by: currentId, to: data.by, sdp: sdp, type: 'sdp-answer' });
            });
          });
          break;
        case 'sdp-answer':
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
            console.log("Setting remote description by answer");
          }, function (e) {
            console.error(e);
          });
          break;
        case 'ice':
          if (data.ice) {
            console.log('Adding ice candidates');
            pc.addIceCandidate(new RTCIceCandidate(data.ice));
          }
          break;
      }
    }

    var socket = Io.connect(config.SIGNALING_SERVER_URL),
        connected = false;

    // Create handlers
    function addHandlers (socket) {
      socket.on('peer.connected', function (params) {
        makeOffer(params.id);
      });
      socket.on('peer.disconnected', function (data) {
        api.trigger('peer.disconnected', [data]);
        if (!$rootScope.$$digest) {
          $rootScope.$apply();
        }
      });
      socket.on('msg', function (data) {
        handleMessage(data);
      });
    }

    // The Room API
    var api = {
      joinRoom: function (r) {
        if (!connected) {
          socket.emit('init', { room: r }, function (roomId, id) {
            currentId: id;
            roomId: roomId;
          });
          connected = true;
        }
      },
      createRoom: function () {
        var d = $q.defer();
        socket.emit('init', null, function (roomId, id) {
          d.resolve(roomId);
          roomId = roomId;
          currentId = id;
          connected = true;
        });
        return d.promise;
      },
      init: function (s) {
        stream = s;
      }
    };
    EventEmitter.call(api);
    Object.setPrototypeOf(api, EventEmitter.prototype);

    addHandlers(socket);
    return api;

  });
