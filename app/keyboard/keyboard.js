(function() {

    'use strict';

    angular
        .module('keyboard', [])
        .service('KeyboardService', KeyboardService);

    KeyboardService.$inject = ['$document'];

    function KeyboardService($document) {
        var that = this;
        var keyEventHandlers = [];

        var UP = 'up';
        var RIGHT = 'right';
        var DOWN = 'down';
        var LEFT = 'left';
        var keyboardMap = {
            37: LEFT,
            38: UP,
            39: RIGHT,
            40: DOWN
        };

        this.init = init;
        this.on = on;

        function init() {
            keyEventHandlers = [];

            $document.bind('keydown', function(e) {
                var key = keyboardMap[e.which];
                if (key) {
                    e.preventDefault();
                    handleKeyEvent(key, e);
                }
            });
        }

        function handleKeyEvent(key, e) {
            if (!keyEventHandlers) {
                return;
            }

            e.preventDefault();
            for (var i = 0; i < keyEventHandlers.length; i++) {
                var callback = keyEventHandlers[i];
                callback(key, e);
            }
        }

        function on(callback) {
            keyEventHandlers.push(callback);
        }
        
    }
})();
