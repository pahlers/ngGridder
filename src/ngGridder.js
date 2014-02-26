angular.module('ngGridder', [])
    .provider('ngGridderSettings', function ngGridderSettingsProvider() {
      'use strict';

      var that = this,
          settings = {
            path: {
              panelDir: './views/panels/',
              panelHtml: '/panel.html',
              settingsHtml: '/settings.html'
            },
            template: {
              ngGridder: 'ngGridder.html',
              ngGridderRow: 'ngGridder-row.html',
              ngGridderCol: 'ngGridder-col.html'
            },
            panel: {
              //panel width over x columns
              minWidth: 1,
              maxWidth: 12
            }
          };

      this.get = function () {
        return settings;
      };

      this.set = function (newSettings) {
        return jQuery.extend(true, settings, newSettings); // why jQuery? If the first property is true, the merge becomes recursive (aka. deep copy).
      };

      this.$get = function ngGridderSettingsFactory() {
        return {
          get: function () {
            return that.get();
          },
          set: function (newSettings) {
            return that.set(newSettings);
          }
        };
      };
    })

    .directive('ngGridderCol', function($http, $templateCache, $compile, $log, ngGridderSettings) {
      'use strict';

      var gridderSettings = ngGridderSettings.get();

      return {
        templateUrl: gridderSettings.template.ngGridderCol,
        restrict: 'E',
        replace: true,
        controller: function($scope) {
          $scope.showSettings = false;

          $scope.minWidth = gridderSettings.panel.minWidth;
          $scope.maxWidth = gridderSettings.panel.maxWidth;
          $scope.colOperations = $scope.rowOperations.col;

          if($scope.col.operations !== undefined){
            $scope.colOperations = jQuery.extend(true, {}, $scope.rowOperations.col, $scope.col.operations);
          }

          $scope.master = {
            settings: angular.copy($scope.col.settings),
            width: angular.copy($scope.col.width)
          };

          $scope.$watch('col.width', function() {
            $scope.colClasses = '';
            angular.forEach($scope.col.width, function(value, key){
              $scope.colClasses += 'col-' + key + '-' + value + ' ';
            });
          }, true);

          $scope.toggleSettings = function() {
            $scope.showSettings = !$scope.showSettings;
          };

          // remove the col
          $scope.remove = function() {
            if($scope.colOperations.remove === true){
              $scope._removeCol($scope.$index);
            }
          };

          // add a new col
          $scope.add = function() {
            if($scope.colOperations.add === true){
              $scope._addCol($scope.$index + 1);
            }
          };

          // move the col to the left
          $scope.left = function() {
            if($scope.colOperations.position === true && !$scope.first){
              $scope._moveToLeftCol($scope.$index);
            }
          };

          // move the col to the right
          $scope.right = function() {
            if($scope.colOperations.position === true && !$scope.last){
              $scope._moveToRightCol($scope.$index);
            }
          };

          // to save the settings/width of a panel
          $scope.save = function() {
            if($scope.colOperations.settings === true){
              $scope.master.settings = angular.copy($scope.col.settings);
              $scope.master.width = angular.copy($scope.col.width);

              $scope.showSettings = false;
              $scope._saveColSettings();
            }
          };

          $scope.cancel = function() {
            $scope.col.settings = angular.copy($scope.master.settings);
            $scope.col.width = angular.copy($scope.master.width);
          };
        },
        link: function(scope, element) {
          scope.$watch('col.type', function() {
            // get template and render
            $log.log('ngGridder: start loading', scope.col.type);

            if(scope.col.type){
              var panelScope = scope.$new(),
                  path = gridderSettings.path,
                  panelUrl = path.panelDir + scope.col.type + path.panelHtml,
                  settingsUrl = path.panelDir + scope.col.type + path.settingsHtml,
                  compilePanel = function(target, panel, panelScope) {
                    var panelElement = $compile(panel)(panelScope);

                    panelScope.$on('$destroy', function(){
                      panelElement.unbind();
                      panelElement.remove();
                    });

                    element.find(target).append(panelElement);
                  };

              if(scope.col.settings){
                panelScope.settings = scope.col.settings;
              }

              if(!$templateCache.get(panelUrl)){
                $log.log('ngGridder: load panel from url', panelUrl);

                $http.get(panelUrl)
                    .success(function(data) {
                      compilePanel('.ng-gridder-panel-content', $templateCache.put(panelUrl, data), panelScope);
                    })
                    .error(function() {
                      $log.error('ngGridder: error, can\'t find panel template:', panelUrl);
                    });

              } else {
                $log.log('ngGridder: load panel from cache', panelUrl);

                compilePanel('.ng-gridder-panel-content', $templateCache.get(panelUrl), panelScope);
              }

              if(scope.colOperations.settings){
                //get the settings.html
                if(!$templateCache.get(settingsUrl)){
                  $log.log('ngGridder: load settings from url', settingsUrl);

                  $http.get(settingsUrl)
                      .success(function(data) {
                        compilePanel('.ng-gridder-settings-content', $templateCache.put(settingsUrl, data), panelScope);
                      })
                      .error(function() {
                        $log.error('ngGridder: error, can\'t find settings template:', settingsUrl);
                      });

                } else {
                  $log.log('ngGridder: load settings from cache', settingsUrl);

                  compilePanel('.ng-gridder-settings-content', $templateCache.get(settingsUrl), panelScope);
                }
              } else {
                scope.showSettings = false;
              }

            } else {
              scope.showSettings = true;
              $log.log('ngGridder: added new panel');
            }
          });
        }
      };
    })

    .directive('ngGridderRow', function($log, ngGridderSettings) {
      'use strict';

      var gridderSettings = ngGridderSettings.get();

      return {
        templateUrl: gridderSettings.template.ngGridderRow,
        restrict: 'E',
        replace: true,
        controller: function($scope) {
          var that = this;

          $scope.name = $scope.row.name;
          $scope.cols = $scope.row.cols;
          $scope.rowOperations = $scope.globalOperations;

          if($scope.row.operations !== undefined){
            $scope.rowOperations = jQuery.extend(true, {}, $scope.globalOperations, $scope.row.operations);
          }

          // remove the row
          $scope.remove = function() {
            if($scope.rowOperations.row.remove === true){
              $scope._removeRow($scope.$index);
            }
          };

          // add a new row
          $scope.add = function() {
            if($scope.rowOperations.row.add === true){
              $scope._addRow($scope.$index + 1);
            }
          };

          // move the row up
          $scope.up = function() {
            if($scope.rowOperations.row.position === true && !$scope.$first){
              $scope._moveToUpRow($scope.$index);
            }
          };

          // move the row down
          $scope.down = function() {
            if($scope.rowOperations.row.position === true && !$scope.last){
              $scope._moveToDownRow($scope.$index);
            }
          };

          $scope._removeCol = function(colIndex) {
            if(!angular.isNumber(colIndex)){
              return;
            }

            $scope.cols.splice(colIndex, 1);

            $scope._changed();

            $log.log('ngGridder: remove col', colIndex);
          };

          $scope.addCol = function() {
            $scope._addCol();
          };

          $scope._addCol = function(colIndex) {
            if(!angular.isNumber(colIndex)){
              colIndex = $scope.cols.length;
            }

            $scope.cols.splice(colIndex, 0, {
              settings: {},
              width: {
                xs: 12,
                sm:12,
                md:6,
                lg:3
              }
            });

            $scope._changed();

            $log.log('ngGridder: add col');
          };

          this._moveTo = function(colIndex, direction) {
            if($scope.cols.length <= 1){
              return;
            }

            // pull col out of row
            var col = $scope.cols.splice(colIndex, 1);

            // add col to row
            $scope.cols.splice(colIndex + direction, 0, col[0]);

            $scope._changed();
            
          };

          $scope._moveToLeftCol = function(colIndex) {
            that._moveTo(colIndex, -1);
          };

          $scope._moveToRightCol = function(colIndex) {
            that._moveTo(colIndex, 1);
          };

          $scope._saveColSettings = function() {
            $scope._changed();
          };
        }
      };
    })

    .directive('ngGridder', function($log, ngGridderSettings) {
      'use strict';

      var gridderSettings = ngGridderSettings.get();

      return {
        templateUrl: gridderSettings.template.ngGridder,
        restrict: 'E',
        replace: true,
        scope: {
          globalOperations: '=operations',
          layout: '=',
          types: '=panelTypes',
          changedImplementation: '&changed'
        },
        controller: function($scope) {
          var that = this,
            defaultOperations = {
              row:{
                add: true,
                remove: true,
                position: true, // up en down
                settings: true
              },
              col:{
                add: true,
                remove: true,
                position: true, // left en right
                settings: true
              }
            };

          // overrule defaults with the given operations aand save these in globalOperations
          $scope.globalOperations = jQuery.extend(true, {}, defaultOperations, $scope.globalOperations);

          if(!angular.isArray($scope.layout)){
            $log.error('ngGridder: need an (empty) layout');
            return;
          }

          $scope._changed = function() {
            $scope.changedImplementation();

            $log.log('ngGridder: layout changed');
          };

          $scope._removeRow = function(rowIndex) {
            if(!angular.isNumber(rowIndex)){
              return;
            }

            $scope.layout.splice(rowIndex, 1);

            $scope._changed();

            $log.log('ngGridder: remove row', rowIndex);
          };

          $scope._addRow = function(rowIndex) {
            if(!angular.isNumber(rowIndex)){
              rowIndex = $scope.layout.length;
            }

            $scope.layout.splice(rowIndex, 0, {
              cols: []
            });

            $scope._changed();

            $log.log('ngGridder: add row', rowIndex);
          };

          this._moveTo = function(rowIndex, direction) {
            if(!angular.isNumber(rowIndex)  || $scope.layout.length <= 1){
              return;
            }

            // pull row out of layout
            var row = $scope.layout.splice(rowIndex, 1);

            // add row to layout
            $scope.layout.splice(rowIndex + direction, 0, row[0]);

            $scope._changed();
            
          };

          $scope._moveToUpRow = function(rowIndex) {
            that._moveTo(rowIndex, -1);
            $log.log('ngGridder: moved a row up', rowIndex);
          };

          $scope._moveToDownRow = function(rowIndex) {
            that._moveTo(rowIndex, 1);

            $log.log('ngGridder: moved a row down', rowIndex);
          };

        }
      };
    });
