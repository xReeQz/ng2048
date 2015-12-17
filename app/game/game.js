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
        this.tiles = gridService.tiles;

        this.move = move;
        this.newGame = newGame;
        this.skipPhantom = skipPhantom;

        function newGame() {
            gridService.initGameBoard();
            gridService.initStartingPosition();
            reinit();
        }

        function move(key) {

            $q.when(f()).then(angular.noop);

            function f() {
                if (hasWon) {
                    return;
                }

                var hasMoved = false;
                var traversalPositions = gridService.getTraversalPositions(key);

                gridService.updateTilesState();

                traversalPositions.x.forEach(function (x) {
                    traversalPositions.y.forEach(function (y) {
                        var originalPosition = { x: x, y: y };
                        var tile = gridService.getTileAtPosition(originalPosition);

                        if (!gridService.isTileHidden(tile)) {
                            var nextPosition = gridService.calculateNextPosition(tile, key);
                            var nextTileAtNewPosition = nextPosition.nextTile;
                            var isMergePossible = nextTileAtNewPosition &&
                                                  !gridService.isTileHidden(nextTileAtNewPosition) &&
                                                  nextTileAtNewPosition.value === tile.value &&
                                                  !nextTileAtNewPosition.isMerged;

                            if (isMergePossible) {

                                gridService.mergeTiles(tile, nextTileAtNewPosition);

                                updateScore(that.currentScore + nextTileAtNewPosition.value);
                                hasWon = nextTileAtNewPosition.value === that.winningValue;

                                hasMoved = true;
                            } else {
                                gridService.moveTile(tile, nextPosition.newPosition);

                                if (!gridService.isSamePosition(originalPosition, nextPosition.newPosition)) {
                                    hasMoved = true;
                                }
                            }

                        }
                    });
                });

                if (hasMoved) {
                    gridService.activateNewRandomTile();

                    if (hasWon || !movesAvailable()) {
                        gameOver = true;
                    }
                }
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
            return gridService.anyHiddenTiles() ||
                gridService.tileMatchesAvailable();
        }

        function skipPhantom(tile) {
            return !('isPhantom' in tile);
        }
    }

})();
