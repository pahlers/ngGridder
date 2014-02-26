angular.module('abcExample', [])
  .directive('abcSettings', function() {
    'use strict';

    return {
      template: '<div class="abc abc-settings"><h1>Settings Abc</h1><label>title <input type="text" ng-model="options.title"/></label><p>{{options.title}}</p></div>',
      restrict: 'E',
      replace: true,
      scope: {
        'options': '='
      },
      controller: function($scope) {
        // console.log('abc settings scope', $scope);
      }
    };
  })

  .directive('abc', function() {
    'use strict';

    return {
      template: '<div class="abc"><h1>Abc</h1>{{options.title}}</div>',
      restrict: 'E',
      replace: true,
      scope: {
        'options': '='
      },
      controller: function($scope) {
        // console.log('abc scope', $scope);
      }
    };
  });
