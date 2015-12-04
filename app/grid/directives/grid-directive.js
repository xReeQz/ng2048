(function () {

    'use strict';

    angular
        .module('grid')
        .directive('grid', gridDirective);

    function gridDirective() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            templateUrl: 'app/grid/directives/grid.html'
        };

        return directive;
    }

})();
