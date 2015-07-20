'use strict';

/**
 * @ngdoc service
 * @name angRtcApp.Io
 * @description
 * # Io
 * Factory in the angRtcApp.
 */
angular.module('angRtcApp')
  .factory('Io', function () {
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
