'use strict';

/**
 * @ngdoc service
 * @name vidConfApp.VideoStream
 * @description
 * # VideoStream
 * Factory in the vidConfApp.
 */
angular.module('vidConfApp')
  .factory('VideoStream', function () {
    var stream;

    return {
      get: function () {
        if (stream) {
          return $q.when(stream);
        } else {
          var d = $q.defer();
          navigator.getUserMedia({
            video: true,
            audio: true
          }, function (s) {
            stream = s;
            d.resolve(stream);
          }, function (e) {
            d.reject(e);
          });
          return d.promise;
        }
      }
    };
  });
