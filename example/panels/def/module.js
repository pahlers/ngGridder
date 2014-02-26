angular.module('defExample', [])
  .directive('defSettings', function() {
    'use strict';

    return {
      template: '<div lass="def def-settings"><h1>Settings Def</h1><label>title <input type="text" ng-model="options.title"/></label><p>{{options.title}}</p></div>',
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
      template: '<div class="def"><h1>Def</h1>{{options.title}}</div>',
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
