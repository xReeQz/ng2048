(function () {

    'use strict';

    angular
        .module('grid')
        .directive('tile', tileDirective);

    function tileDirective() {
        var directive = {
            restrict: 'A',
            scope: {
                ngModel: '='
            },
            templateUrl: 'app/grid/directives/tile.html'
        };

        return directive;
    }
})();
