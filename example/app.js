'use strict';

/**
* Example Module
*
*/
angular.module('example', ['ngGridder', 'abcExample', 'defExample','subGrid'])
  .controller('ExampleCtrl', function($scope) {
    $scope.changed = function() {
      console.log('ExampleCtrl: something changed');
    };

    $scope.lockPosition = true;

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
            lockPosition: false,
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
        lockPosition: false,
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
              lockPosition: true
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
        cols: [
          {
            settings: {
              title:  'Hello wideworld'
            },
            width: {
              xs: 12,
              sm: 12,
              md: 12,
              lg: 12
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


