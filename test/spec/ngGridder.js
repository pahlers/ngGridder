'use strict';

describe('Module: ngGridder', function () {
  var $scope, $compile, $httpBackend, layout,
    render = function() {
      var elm = $compile('<ng-gridder layout="layout" panel-types="panelTypes" changed="changed()" lock-position="lockPosition"></ng-gridder>')($scope);

      $scope.$digest();

      return elm;
    };


  // load the modules
  beforeEach(function() {
    module('allViews');
    module('ngGridder');
    module('abcExample');
    module('defExample');
  });

  // load defaults
  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$httpBackend_) {
    $scope = _$rootScope_;
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;

    // load the views
    _$templateCache_.put('./views/panels/abc/panel.html', '<abc options="settings"></abc>');
    _$templateCache_.put('./views/panels/abc/settings.html', '<abc-settings options="settings" save="save()"></abc-settings>');
    _$templateCache_.put('./views/panels/def/panel.html', '<def options="settings"></def>');
    _$templateCache_.put('./views/panels/def/settings.html', '<def-settings options="settings" save="save()"></def-settings>');

    layout = [
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

  }));

  it('should render correct with empty attributes', function () {
    $scope.layout = [];
    $scope.panelTypes = [];
    $scope.changed = function() {};
    // $scope.lockPosition = true;

    var elm = render();

    expect(elm.html()).toContain('<div class="ng-gridder-rows">');
    expect(elm.find('.row').length).toBe(1);
    expect(elm.html()).toContain('Add row');
  });

  describe('it\'s layout', function() {
    var elm;

    beforeEach(function () {
      $scope.layout = layout;
    });

    it('should render two .ng-gridder-rows', function () {
      elm = render();
      expect(elm.find('.ng-gridder-row').length).toBe(2);
    });

    it('should render five .ng-gridder-col', function () {
      elm = render();
      expect(elm.find('.ng-gridder-col').length).toBe(5);
    });

    it('should render three .abc-settings', function () {
      elm = render();
      expect(elm.find('.abc-settings').length).toBe(3);
    });

    it('should enable navigation when lockPosition is false', function () {
      $scope.lockPosition = false;
      elm = render();
      expect(elm.find('.ng-gridder-nav-remove-row, .ng-gridder-nav-remove-col').length).toBe(7);
    });

    it('should disable edit navigation when lockPosition is true', function () {
      $scope.lockPosition = true;
      elm = render();
      expect(elm.find('.ng-gridder-nav-remove-row, .ng-gridder-nav-remove-col').length).toBe(0);
    });

    it('should overrule the global with row lockPosition for row and col', function () {
      $scope.lockPosition = true;
      $scope.layout[0].lockPosition = false;

      elm = render();
      
      var ngGridderRow = elm.find('.ng-gridder-row').first();

      expect(ngGridderRow.find('.ng-gridder-nav-remove-row').length).toBe(1);
      expect(ngGridderRow.find('.ng-gridder-nav-remove-col').length).toBe(4);
    });

    it('should overrule the global and row with col lockPosition', function () {
      $scope.lockPosition = false;
      $scope.layout[0].lockPosition = true;
      $scope.layout[0].cols[0].lockPosition = false;
      $scope.layout[0].cols[1].lockPosition = false;

      elm = render();
      
      var ngGridderRow = elm.find('.ng-gridder-row').first();

      expect(ngGridderRow.find('.ng-gridder-nav-remove-row').length).toBe(0);
      expect(ngGridderRow.find('.ng-gridder-nav-remove-col').length).toBe(2);
    });

    it('should not show the move up button on the top row', function () {
      elm = render();

      var firstNgGridderRow = elm.find('.ng-gridder-row').first();
      expect(firstNgGridderRow.find('.ng-gridder-nav-up-row').length).toBe(0);

      var secondNgGridderRow = elm.find('.ng-gridder-row').eq(1);
      expect(secondNgGridderRow.find('.ng-gridder-nav-up-row').length).toBe(1);
    });

    it('should not show the move down button on the bottom row', function () {
      elm = render();

      var lastNgGridderRow = elm.find('.ng-gridder-row').last();
      expect(lastNgGridderRow.find('.ng-gridder-nav-down-row').length).toBe(0);
    });

    it('should not show the move left button on the first column', function () {
      elm = render();

      var ngGridderCol = elm.find('.ng-gridder-row').first().find('.ng-gridder-col').first();
      expect(ngGridderCol.find('.ng-gridder-nav-left-col').length).toBe(0);

      var ngGridderCol2 = elm.find('.ng-gridder-row').first().find('.ng-gridder-col').eq(1);
      expect(ngGridderCol2.find('.ng-gridder-nav-left-col').length).toBe(1);
    });

    it('should not show the move right button on the last column', function () {
      elm = render();

      var ngGridderCol = elm.find('.ng-gridder-row').first().find('.ng-gridder-col').last();
      expect(ngGridderCol.find('.ng-gridder-nav-right-col').length).toBe(0);
    });

  });

  describe('it\'s controller', function() {
    describe('ngGridder', function() {
      beforeEach(function() {
        $scope.layout = [];
        $scope.panelTypes = [];
        $scope.changed = function() {};
        $scope.lockPosition = true;
      });

      it('should add a row and tell that the model is changed', function() {
        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridder = elm.isolateScope();

        ngGridder.addRow();

        expect($scope.layout.length).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should add a row with index and tell that the model is changed', function() {
        $scope.layout = [{cols:[{}]}];
        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridder = elm.isolateScope();

        ngGridder.addRow(1);

        expect($scope.layout.length).toBe(2);
        expect($scope.layout[0].cols.length).toBe(1);
        expect($scope.layout[1].cols.length).toBe(0);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should remove a row and tell that the model is changed', function() {
        $scope.layout = [{cols:[]},{cols:[{}]}];
        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridder = elm.isolateScope();

        ngGridder.removeRow(1);

        expect($scope.layout.length).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should move a row up and tell that the model is changed', function() {
        $scope.layout = [{cols:[]},{cols:[{}]}];
        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridder = elm.isolateScope();

        ngGridder.moveToUpRow(1);

        expect($scope.layout[0].cols.length).toBe(1);
        expect($scope.layout[1].cols.length).toBe(0);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should do nothing when try to move one row up', function() {
        $scope.layout = [{cols:[]}];
        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridder = elm.isolateScope();

        ngGridder.moveToUpRow(1);

        expect($scope.changed).not.toHaveBeenCalled();
      });

      it('should move a row down and tell that the model is changed', function() {
        $scope.layout = [{cols:[{}]},{cols:[]}];
        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridder = elm.isolateScope();

        ngGridder.moveToDownRow(0);

        expect($scope.layout[0].cols.length).toBe(0);
        expect($scope.layout[1].cols.length).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should do nothing when try to move one row down', function() {
        $scope.layout = [{cols:[]}];
        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridder = elm.isolateScope();

        ngGridder.moveToDownRow(0);

        expect($scope.changed).not.toHaveBeenCalled();
      });
    });

    describe('ngGridderRow', function() {
      beforeEach(function() {
        $scope.layout = [];
        $scope.panelTypes = [];
        $scope.changed = function() {};
        $scope.lockPosition = true;
      });

      it('should add a row under the selected row and tell that the model is changed', function() {
        $scope.layout = [{cols:[]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').scope();

        ngGridderRow.add();

        expect($scope.layout.length).toBe(2);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should remove a row and tell that the model is changed', function() {
        $scope.layout = [{cols:[]},{cols:[]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').first().scope();

        ngGridderRow.remove();

        expect($scope.layout.length).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should move a row up and tell that the model is changed', function() {
        $scope.layout = [{cols:[]},{cols:[{}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').last().scope();

        ngGridderRow.up();

        expect($scope.layout[0].cols.length).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should move a row down and tell that the model is changed', function() {
        $scope.layout = [{cols:[{}]},{cols:[]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').first().scope();

        ngGridderRow.down();

        expect($scope.layout[1].cols.length).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should remove a col from the row and tell that the model is changed', function() {
        $scope.layout = [{cols:[{},{},{}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').scope();

        ngGridderRow.removeCol(1);

        expect($scope.layout[0].cols.length).toBe(2);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should add a col without an index to the row and tell that the model is changed', function() {
        $scope.layout = [{cols:[{n:1},{n:2}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').scope();

        ngGridderRow.addCol();

        expect($scope.layout[0].cols.length).toBe(3);
        expect($scope.layout[0].cols[0].n).toBe(1);
        expect($scope.layout[0].cols[1].n).toBe(2);
        expect($scope.layout[0].cols[2].n).toBeUndefined();
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should add a col with an index to the row and tell that the model is changed', function() {
        $scope.layout = [{cols:[{n:1},{n:2}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').scope();

        ngGridderRow.addCol(1);

        expect($scope.layout[0].cols.length).toBe(3);
        expect($scope.layout[0].cols[0].n).toBe(1);
        expect($scope.layout[0].cols[1].n).toBeUndefined();
        expect($scope.layout[0].cols[2].n).toBe(2);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should move a col to the left and tell that the model is changed', function() {
        $scope.layout = [{cols:[{n:1},{n:2}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').scope();

        ngGridderRow.moveToLeftCol(1);

        expect($scope.layout[0].cols.length).toBe(2);
        expect($scope.layout[0].cols[0].n).toBe(2);
        expect($scope.layout[0].cols[1].n).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should move a col to the right and tell that the model is changed', function() {
        $scope.layout = [{cols:[{n:1},{n:2}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').scope();

        ngGridderRow.moveToRightCol(0);

        expect($scope.layout[0].cols.length).toBe(2);
        expect($scope.layout[0].cols[0].n).toBe(2);
        expect($scope.layout[0].cols[1].n).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should the model is changed when somebody saves the col settings', function() {
        $scope.layout = [{}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderRow = elm.find('.ng-gridder-row').scope();

        ngGridderRow.saveColSettings();

        expect($scope.changed).toHaveBeenCalled();
      });
    });

    describe('ngGridderCol', function() {
      beforeEach(function() {
        $scope.layout = [];
        $scope.panelTypes = [];
        $scope.changed = function() {};
      });

      it('should add a col after the selected col and tell that the model is changed', function() {
        $scope.layout = [{cols:[{n:1}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderCol = elm.find('.ng-gridder-col').scope();

        ngGridderCol.add();

        expect($scope.layout[0].cols.length).toBe(2);
        expect($scope.layout[0].cols[0].n).toBe(1);
        expect($scope.layout[0].cols[1].n).toBeUndefined();
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should remove a col and tell that the model is changed', function() {
        $scope.layout = [{cols:[{n:1},{n:2}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderCol = elm.find('.ng-gridder-col').first().scope();

        ngGridderCol.remove();

        expect($scope.layout[0].cols.length).toBe(1);
        expect($scope.layout[0].cols[0].n).toBe(2);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should move a col to the left and tell that the model is changed', function() {
        $scope.layout = [{cols:[{n:1},{n:2}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderCol = elm.find('.ng-gridder-col').last().scope();

        ngGridderCol.left();

        expect($scope.layout[0].cols.length).toBe(2);
        expect($scope.layout[0].cols[0].n).toBe(2);
        expect($scope.layout[0].cols[1].n).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should move a col to the right and tell that the model is changed', function() {
        $scope.layout = [{cols:[{n:1},{n:2}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderCol = elm.find('.ng-gridder-col').first().scope();

        ngGridderCol.right();

        expect($scope.layout[0].cols.length).toBe(2);
        expect($scope.layout[0].cols[0].n).toBe(2);
        expect($scope.layout[0].cols[1].n).toBe(1);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should save the settings/width of a col and tell that the model is changed', function() {
        $scope.layout = [{cols:[{settings:{n:1}, width:{n:1}}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderCol = elm.find('.ng-gridder-col').scope();

        ngGridderCol.col.settings.n = 2;
        ngGridderCol.col.width.n = 2;
        ngGridderCol.save();

        expect($scope.layout[0].cols[0].settings.n).toBe(2);
        expect($scope.layout[0].cols[0].width.n).toBe(2);
        expect($scope.changed).toHaveBeenCalled();
      });

      it('should reset the settings/width when call cancel', function() {
        $scope.layout = [{cols:[{settings:{n:1}, width:{n:1}}]}];

        window.spyOn($scope, 'changed');

        var elm = render(),
          ngGridderCol = elm.find('.ng-gridder-col').scope();

        ngGridderCol.col.settings.n = 2;
        ngGridderCol.col.width.n = 2;
        ngGridderCol.cancel();

        expect($scope.layout[0].cols[0].settings.n).toBe(1);
        expect($scope.layout[0].cols[0].width.n).toBe(1);
        expect($scope.changed).not.toHaveBeenCalled();
      });
    });
  });

});
