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
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
