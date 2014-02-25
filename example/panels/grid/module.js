angular.module('subGrid', [])
  .directive('gridSettings', function() {
    'use strict';

    return {
      template: '<div class="subgrid"><label>title <input type="text" ng-model="options.title"/></label><p>{{options.title}}</p></div>',
      restrict: 'E',
      replace: true,
      scope: {
        options: '='
      },
      controller: function($scope) {
        console.log('grid settings scope', $scope);
      }
    };
  })

  .directive('grid', function() {
    'use strict';

    return {
      template: '<div class="sub-grid"><ng-gridder layout="layout" panel-types="panelTypes" changed="changed()" operations="operations"></ng-gridder></div>',
      restrict: 'E',
      replace: true,
      scope: {
        options: '=',
        changed: '&'
      },
      controller: function($scope) {
        $scope.layout = $scope.options.layout;
        $scope.panelTypes = $scope.options.panelTypes;
        $scope.operations = $scope.options.operations;

        if(!$scope.layout){
          $scope.layout = [];
        }

        if(!$scope.panelTypes){
          $scope.panelTypes = ['abc','def'];
        }


      }
    };
  });
