(function () {

    'use strict';

    angular
        .module('grid')
        .directive('grid', gridDirective);

    function gridDirective() {
        var directive = {
            restrict: 'A',
            scope: {
                ngModel: '='
            },
            templateUrl: 'app/grid/directives/grid.html'
        };

        return directive;
    }

})();
