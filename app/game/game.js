(function () {

    'use strict';

    angular
        .module('game', ['grid', 'ngCookies'])
        .service('GameManager', GameManager);

    GameManager.$inject = ['GridService', '$cookieStore'];

    function GameManager(gridService, $cookieStore) {
        var that = this;

        var gameOver;
        var hasWon;

        this.winningValue = 2048;

        this.move = move;
        this.newGame = newGame;

        this.grid = gridService.grid;
        this.tiles = gridService.tiles;

        function newGame() {
            gridService.buildEmptyGameBoard();
            gridService.buildStartingPosition();
            reinit();
        }

        function move(key) {
            if (hasWon) {
                return false;
            }

            var hasMoved = false;
            var positions = gridService.getTraversalDirections(key);

            gridService.prepareTiles();

            positions.x.forEach(function (x) {
                positions.y.forEach(function (y) {
                    var originalPosition = { x: x, y: y };
                    var tile = gridService.getCellAt(originalPosition);

                    if (tile) {
                        var cell = gridService.calculateNextPosition(tile, key);
                        var next = cell.next;

                        console.log(tile.x + ' => ' + cell.newPosition.x + '; ' + tile.y + ' => ' + cell.newPosition.y);

                        if (next && next.value === tile.value && !next.merged) {
                            var newValue = tile.value * 2;
                            var mergedTile = gridService.newTile(tile, newValue);
                            mergedTile.merged = [tile, cell.next];

                            gridService.insertTile(mergedTile);
                            gridService.removeTile(tile);
                            gridService.moveTile(mergedTile, next);

                            updateScore(that.currentScore + newValue);

                            if (mergedTile.value === that.winningValue) {
                                hasWon = true;
                            }

                            hasMoved = true;
                        } else {
                            gridService.moveTile(tile, cell.newPosition);
                        }

                        if (!gridService.isSamePosition(originalPosition, cell.newPosition)) {
                            hasMoved = true;
                        }
                    }
                });
            });

            if (hasMoved) {
                gridService.insertNewTileRandomly();

                if (hasWon || !movesAvailable()) {
                    gameOver = true;
                }
            }

            return true;
        }

        function updateScore(newScore) {
            that.currentScore = newScore;

            if (that.currentScore > getHighScore()) {
                that.highScore = newScore;
                $cookieStore.put('highScore', newScore);
            }
        }

        function getHighScore() {
            return +$cookieStore.get('highScore') || 0;
        }

        function reinit() {
            hasWon = false;
            gameOver = false;
            that.highScore = getHighScore();
            that.currentScore = 0;
        }

        function movesAvailable() {
            return gridService.anyCellsAvailable() ||
                gridService.tileMatchesAvailable();
        }
    }

})();
