'use strict';

/**
 * @ngdoc directive
 * @name vidConfApp.directive:videoPlayer
 * @description
 * # videoPlayer
 */
angular.module('vidConfApp')
  .directive('videoPlayer', function () {
    return {
      template: '<div><video ng-src="" autoplay></video></div>',
      restrict: 'E',
      replace: true,
      scope: {
        vidSrc: '@'
      },
      link: function(scope) {
        console.log('Initializing video player');
        scope.trustSrc = function() {
          if(!scope.vidSrc) {
            return undefined;
          } else {
            return $sce.trustAsResourceUrl(scope.vidSrc);
          };
        }
    };
  });
