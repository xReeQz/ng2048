(function () {

    'use strict';

    angular
        .module('game', ['grid', 'ngCookies'])
        .service('GameManager', GameManager);

    GameManager.$inject = ['$q', '$timeout', 'GridService', '$cookieStore'];

    function GameManager($q, $timeout, gridService, $cookieStore) {
        var that = this;

        var hasWon;
        var gameOver;

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

            $q.when(f()).then(function() {
                console.log(that.tiles
                    .filter(function (item) { return !!item; })
                    .map(function (item) { return item.uid; }));
            });

            function f() {
                if (hasWon) {
                    return;
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

                            if (next && next.value === tile.value && !next.merged) {
                                var newValue = tile.value * 2;
                                var mergedTile = gridService.newTile(tile, newValue);

                                mergedTile.merged = true;
                                gridService.moveTile(tile, cell.newPosition);

                                gridService.removeTile(tile);
                                gridService.insertTile(mergedTile);
                                gridService.moveTile(mergedTile, next);

                                updateScore(that.currentScore + newValue);
                                hasWon = mergedTile.value === that.winningValue;

                                hasMoved = true;
                            } else {
                                gridService.moveTile(tile, cell.newPosition);

                                if (!gridService.isSamePosition(originalPosition, cell.newPosition)) {
                                    hasMoved = true;
                                }
                            }

                        }
                    });
                });

/*
                $timeout(function () {
                    if (hasMoved) {
                        gridService.insertNewTileRandomly();

                        if (hasWon || !movesAvailable()) {
                            gameOver = true;
                        }
                    }
                }, 3000);
*/
            }
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
