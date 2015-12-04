(function() {

    'use strict';

    angular
        .module('grid', [])
        .service('GridService', GridService)
        .factory('TileModel', TileModel);

    GridService.$inject = ['TileModel'];

    function GridService(Tile) {
        var that = this;

        var SIZE = 4;
        var STARTING_TILE_NUMBER = 2;
        var TOTAL = SIZE * SIZE;
        var vectors = {
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            up: { x: 0, y: -1 }
    }

        this.grid = [];
        this.tiles = [];

        this.forEach = forEach;
        this.setCellAt = setCellAt;
        this.getCellAt = getCellAt;
        this.withinGrid = withinGrid;
        this.getEmptyCells = getEmptyCells;
        this.buildEmptyGameBoard = buildEmptyGameBoard;
        this.buildStartingPosition = buildStartingPosition;

        function buildEmptyGameBoard() {
            for (var i = 0; i < TOTAL; i++) {
                that.grid[i] = null;
            }

            that.forEach(function (x, y) {
                that.setCellAt({ x: x, y: y });
            });
        }

        function forEach(callback) {
            for (var i = 0; i < TOTAL; i++) {
                var pos = positionToCoordinates(i);
                callback(pos.x, pos.y, that.tiles[i]);
            }
        }

        function setCellAt(pos, tile) {
            if (that.withinGrid(pos)) {
                var xPos = coordinatesToPosition(pos);
                that.tiles[xPos] = tile;
            }
        }

        function getCellAt(pos) {
            if (that.withinGrid(pos)) {
                var xPos = coordinatesToPosition(pos);
                return that.tiles[xPos];
            } else {
                return null;
            }
        }

        function withinGrid(cell) {
            return cell.x >= 0 && cell.x < SIZE &&
                   cell.y >= 0 && cell.y < SIZE;
        }

        function positionToCoordinates(i) {
            var x = i % SIZE;
            var y = (i - x) / SIZE;

            return { x: x, y: y };
        }

        function coordinatesToPosition(pos) {
            return pos.y * SIZE + pos.x;
        }

        function buildStartingPosition() {
            for (var i = 0; i < STARTING_TILE_NUMBER; i++) {
                insertNewTileRandomly();
            }
        }

        function getEmptyCells() {
            var cells = [];

            that.forEach(function(x, y, tile) {
                if (!tile) {
                    cells.push({ x: x, y: y });
                }
            });

            return cells;
        }

        function getRandomEmptyCell() {
            var emptyCells = getEmptyCells();

            if (emptyCells.length > 0) {
                var randomIndex = Math.floor(Math.random() * emptyCells.length);

                return emptyCells[randomIndex];
            }

            return null;
        }

        function insertTile(tile) {
            var position = coordinatesToPosition(tile);
            that.tiles[position] = tile;
        }

        function removeTile(pos) {
            var position = coordinatesToPosition(pos);
            delete that.tiles[position];
        }

        function insertNewTileRandomly() {
            var cell = getRandomEmptyCell();

            if (cell) {
                insertTile(new Tile(cell, 2));
            }

            return;
        }

    }

    function TileModel() {
        return function(pos, val) {
            this.x = pos.x;
            this.y = pos.y;
            this.value = val || 2;
        }
    }

})();