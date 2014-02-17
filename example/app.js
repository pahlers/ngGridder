'use strict';

/**
* Example Module
*
*/
angular.module('example', ['ngGridder', 'abcExample', 'defExample'])
  .controller('ExampleCtrl', function($scope) {
    $scope.changed = function() {
      console.log('ExampleCtrl: something changed');
    };

    $scope.editable = true;

    $scope.panelTypes = [
      'abc',
      'def'
    ];

    $scope.panels = [
      {
        cols: [
          {
            settings: {
              title:  'Hello'
            },
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 3
            },
            type: 'abc'
          }, {
            settings: {},
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 3
            },
            type: 'def'
          }, {
            settings: {
              title: 'World'
            },
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 3
            },
            type: 'abc'
          }, {
            settings: {},
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 3
            },
            type: 'def'
          }
        ]
      }, {
        cols: [
          {
            settings: {},
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 3
            },
            type: 'def'
          }, {
            settings: {
              title: '!'
            },
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 3
            },
            type: 'abc'
          }
        ]
      }
    ];

  }).config(function(ngGridderSettingsProvider) {
    ngGridderSettingsProvider.set({
      path:{
        panelDir: './panels/' // default './views/panels'
      }
    });
  });


