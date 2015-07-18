'use strict';

/**
 * @ngdoc service
 * @name vidConfApp.Io
 * @description
 * # Io
 * Factory in the vidConfApp.
 */
angular.module('vidConfApp')
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
