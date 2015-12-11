(function () {

    'use strict';

    angular
        .module('twenty48App', ['game', 'grid', 'keyboard', 'ngCookies'])
        .controller('GameController', GameController);

    GameController.$inject = ['$scope', 'GameManager', 'KeyboardService'];

    function GameController($scope, gameManager, keyboardService) {
        var that = this;

        this.game = gameManager;
        this.newGame = newGame;
        this.startGame = startGame;

        this.newGame();

        function newGame() {
            keyboardService.init();
            that.game.newGame();
            that.startGame();
        }

        function startGame() {
            keyboardService.on(function (key) {
                that.game.move(key);
            });
        }
    }

})();
