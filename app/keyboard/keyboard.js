(function() {

    'use strict';

    angular
        .module('keyboard', [])
        .service('KeyboardService', KeyboardService);

    KeyboardService.$inject = ['$document'];

    function KeyboardService($document) {
        var that = this;

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

        this.on = on;
        this.init = init;
        this.keyEventHandlers = [];

        function init() {
            $document.bind('keydown', function(e) {
                var key = keyboardMap[e.which];
                if (key) {
                    e.preventDefault();
                    handleKeyEvent(key, e);
                }
            });
        }

        function handleKeyEvent(key, e) {
            if (!that.keyEventHandlers.length) {
                return;
            }

            e.preventDefault();
            for (var i = 0; i < that.keyEventHandlers.length; i++) {
                var callback = that.keyEventHandlers[i];
                callback(key, e);
            }
        }

        function on(callback) {
            that.keyEventHandlers.push(callback);
        }
        
    }
})();
