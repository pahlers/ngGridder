'use strict';

/**
* Example Module
*
*/
angular.module('example', ['ngGridder', 'abcExample', 'defExample','subGrid'])
  .controller('ExampleCtrl', function($scope, $log) {
    $scope.changed = function() {
      $log.log('ExampleCtrl: something changed');
    };

    $scope.operations = {
      row:{
        add: false,
        remove: false,
        position: false // up en down
      },
      col:{
        add: false,
        remove: false,
        position: false, // left en right
        settings: false
      }
    };

    $scope.panelTypes = [
      'grid',
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
              lg: 6
            },
            type: 'abc'
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
          },
          {
            settings: {
              layout: [
                {
                  cols:[
                    {
                      settings: {
                        title:  'Hello'
                      },
                      width: {
                        xs: 12,
                        sm: 12,
                        md: 6,
                        lg: 6
                      },
                      type: 'abc'
                    }, {
                      settings: {
                        title:  'underworld'
                      },
                      width: {
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 6
                      },
                      type: 'def'
                    }
                  ]
                }
              ],
              panelTypes:['abc','def'],
            },
            width: {
              xs: 12,
              sm: 12,
              md: 12,
              lg: 6
            },
            type: 'grid'
          }
        ]
      },
      {
        lockPosition: false,
        cols: [
          {
            settings: {
              title:  'Hello wideworld'
            },
            width: {
              xs: 12,
              sm: 12,
              md: 12,
              lg: 4
            },
            type: 'abc'
          },
          {
            settings: {
              title:  'Hello wideworld'
            },
            width: {
              xs: 12,
              sm: 12,
              md: 12,
              lg: 4
            },
            type: 'abc'
          },
          {
            settings: {
              title:  'Hello wideworld'
            },
            width: {
              xs: 12,
              sm: 12,
              md: 12,
              lg: 4
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


