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
          $scope.colEditable = $scope.rowEditable;

          if($scope.col.editable !== undefined){
            $scope.colEditable = $scope.col.editable;
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

          $scope.remove = function() {
            $scope.removeCol($scope.$index);
          };

          $scope.add = function() {
            $scope.addCol($scope.$index + 1);
          };

          $scope.left = function() { //TODO moveLeft
            if(!$scope.first){
              $scope.leftCol($scope.$index);
            }
          };

          $scope.right = function() { //TODO moveRight
            if(!$scope.last){
              $scope.rightCol($scope.$index);
            }
          };

          // to save the settings/width of a panel
          $scope.save = function() {
            $scope.master.settings = angular.copy($scope.col.settings);
            $scope.master.width = angular.copy($scope.col.width);

            $scope.showSettings = false;
            $scope.saveColSettings();
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
                  loadPanel = function(target, panel, panelScope) { // TODO rename >> compilePanel
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
                      loadPanel('.ng-gridder-panel-content', $templateCache.put(panelUrl, data), panelScope);
                    })
                    .error(function() {
                      $log.error('ngGridder: error, can\'t find panel template:', panelUrl);
                    });

              } else {
                $log.log('ngGridder: load panel from cache', panelUrl);

                loadPanel('.ng-gridder-panel-content', $templateCache.get(panelUrl), panelScope);
              }

              //get the settings.html
              if(!$templateCache.get(settingsUrl)){
                $log.log('ngGridder: load settings from url', settingsUrl);

                $http.get(settingsUrl)
                    .success(function(data) {
                      loadPanel('.ng-gridder-settings-content', $templateCache.put(settingsUrl, data), panelScope);
                    })
                    .error(function() {
                      $log.error('ngGridder: error, can\'t find settings template:', settingsUrl);
                    });

              } else {
                $log.log('ngGridder: load settings from cache', settingsUrl);

                loadPanel('.ng-gridder-settings-content', $templateCache.get(settingsUrl), panelScope);
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
          $scope.name = $scope.row.name;
          $scope.cols = $scope.row.cols;
          $scope.rowEditable = $scope.globalEditable;

          if($scope.row.editable !== undefined){
            $scope.rowEditable = $scope.row.editable;
          }

          $scope.remove = function() {
            $scope.removeRow($scope.$index);
          };

          $scope.add = function() {
            $scope.addRow($scope.$index + 1);
          };

          $scope.up = function() {
            if(!$scope.$first){
              $scope.upRow($scope.$index);
            }
          };

          $scope.down = function() {
            if(!$scope.last){
              $scope.downRow($scope.$index);
            }
          };

          $scope.removeCol = function(colIndex) {
            if(!angular.isNumber(colIndex)){
              return;
            }

            $scope.cols.splice(colIndex, 1);

            $scope.changed();

            $log.log('ngGridder: remove col', colIndex);
          };

          $scope.addCol = function(colIndex) {
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

            $scope.changed();

            $log.log('ngGridder: add col');
          };

          $scope.leftCol = function(colIndex) {
            if($scope.cols.length <= 1){
              return;
            }

            // pull col out of row
            var col = $scope.cols.splice(colIndex, 1);

            // add col to row
            $scope.cols.splice(colIndex - 1, 0, col[0]);

            $scope.changed();
          };

          $scope.rightCol = function(colIndex) {
            if($scope.cols.length <= 1){
              return;
            }

            // pull col out of row
            var col = $scope.cols.splice(colIndex, 1);

            // add col to row
            $scope.cols.splice(colIndex + 1, 0, col[0]); // TODO de + ipv - is het enige verschil met de function leftCol, in 1 methode stoppen?

            $scope.changed();
          };

          $scope.saveColSettings = function() {
            $scope.changed();
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
          globalEditable: '=editable',
          layout: '=',
          types: '=panelTypes',
          changedImplementation: '&changed'
        },
        controller: function($scope) {
          if(!angular.isArray($scope.layout)){
            $log.error('ngGridder: need an (empty) layout');
            return;
          }

          $scope.changed = function() {
            $scope.changedImplementation();

            $log.log('ngGridder: layout changed');
          };

          $scope.removeRow = function(rowIndex) {
            if(!angular.isNumber(rowIndex)){
              return;
            }

            $scope.layout.splice(rowIndex, 1);

            $scope.changed();

            $log.log('ngGridder: remove row', rowIndex);
          };

          $scope.addRow = function(rowIndex) {
            if(!angular.isNumber(rowIndex)){
              rowIndex = $scope.layout.length;
            }

            $scope.layout.splice(rowIndex, 0, {
              cols: []
            });

            $scope.changed();

            $log.log('ngGridder: add row', rowIndex);
          };

          //TODO upRow and downRow >> moveRowUp and moveRowDown?
          $scope.upRow = function(rowIndex) {
            if(!angular.isNumber(rowIndex)  || $scope.layout.length <= 1){
              return;
            }

            // pull row out of layout
            var row = $scope.layout.splice(rowIndex, 1);

            // add row to layout
            $scope.layout.splice(rowIndex - 1, 0, row[0]);

            $scope.changed();

            $log.log('ngGridder: moved a row up', rowIndex);
          };

          $scope.downRow = function(rowIndex) {
            if(!angular.isNumber(rowIndex) || $scope.layout.length <= 1){
              return;
            }

            // pull row out of layout
            var row = $scope.layout.splice(rowIndex, 1);

            // add row to layout
            $scope.layout.splice(rowIndex + 1, 0, row[0]); // TODO upRow is same method, merge

            $scope.changed();

            $log.log('ngGridder: moved a row down', rowIndex);
          };

        }
      };
    });
