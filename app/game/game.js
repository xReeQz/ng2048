(function () {

    'use strict';

    angular
        .module('game', [])
        .service('GameManager', GameManager);

    GameManager.$inject = ['GridService'];

    function GameManager(gridService) {
        var that = this;
        var gameOver;
        var win;

        this.move = move;
        this.newGame = newGame;
        this.grid = gridService.grid;
        this.tiles = gridService.tiles;
        this.updateScore = updateScore;
        this.movesAvailable = movesAvailable;

        function newGame() {
            gridService.buildEmptyGameBoard();
            gridService.buildStartingPosition();
            reinit();
        }

        function move() {
            if (win) {
                return false;
            }
        }

        function updateScore() {
            
        }

        function reinit() {
            win = false;
            gameOver = false;
            that.highScore = 0;
            that.currentScore = 0;
        }

        function movesAvailable() {
            return gridService.anyCellsAvailable() ||
                gridService.tileMatchesAvailable();
        }
    }

})();
