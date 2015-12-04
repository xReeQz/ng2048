(function () {

    'use strict';

    angular
        .module('twenty48App', ['game', 'grid', 'keyboard'])
        .controller('GameController', GameController);

    GameController.$inject = ['GameManager', 'KeyboardService'];

    function GameController(gameManager, keyboardService) {
        var that = this;

        this.game = gameManager;
        this.newGame = newGame;

        this.newGame();

        function newGame() {
            keyboardService.init();
            that.game.newGame();
            startGame();
        }

        function startGame() {
            keyboardService.on(function(key) {
                that.game.move(key);
            });
        }
    }

})();
