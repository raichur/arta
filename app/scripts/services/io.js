'use strict';

/**
 * @ngdoc service
 * @name vidConfApp.Io
 * @description
 * # Io
 * Factory in the vidConfApp.
 */
 angular.module('publicApp')
   .factory('Io', function () {
     if (typeof io === 'undefined') {
       throw new Error('Socket.io required');
     }
     return io;
   });
