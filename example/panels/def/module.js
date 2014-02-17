angular.module('defExample', [])
  .directive('defSettings', function() {
    'use strict';

    return {
      template: '<div lass="def def-settings"><label>title <input type="text" ng-model="options.title"/></label><p>{{options.title}}</p></div>',
      restrict: 'E',
      replace: true,
      scope: {
        'options': '=',
        'save': '&'
      },
      controller: function($scope) {
        // console.log('def settings scope', $scope);
      }
    };
  })
  .directive('def', function() {
    'use strict';

    return {
      template: '<div lass="def">{{options.title}}</div>',
      restrict: 'E',
      replace: true,
      scope: {
        'options': '='
      },
      controller: function($scope) {
        // console.log('def scope', $scope);
      }
    };
  });
