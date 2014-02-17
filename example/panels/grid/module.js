angular.module('subGrid', [])
  .directive('gridSettings', function() {
    'use strict';

    return {
      template: '<div class="subgrid"><label>title <input type="text" ng-model="options.title"/></label><p>{{options.title}}</p></div>',
      restrict: 'E',
      replace: true,
      scope: {
        'options': '='
      },
      controller: function($scope) {
        console.log('grid settings scope', $scope);
      }
    };
  })

  .directive('grid', function() {
    'use strict';

    return {
      template: '<div class="sub-grid"><ng-gridder layout="options.layout" panel-types="options.panelTypes" changed="changed()" editable="options.editable"></ng-gridder></div>',
      restrict: 'E',
      replace: true,
      scope: {
        'options': '=',
        changed: '&'
      },
      controller: function($scope) {
        if(!$scope.options.layout){
          $scope.options.layout = [];
        }

        if(!$scope.options.panelTypes){
          $scope.options.panelTypes = ['abc','def'];
        }

        if(!$scope.options.editable){
          $scope.options.editable = true;
        }
      }
    };
  });
