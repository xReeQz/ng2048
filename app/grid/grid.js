(function () {

    'use strict';

    angular
        .module('grid', [])
        .service('GridService', GridService)
        .factory('TileModel', TileModel);

    GridService.$inject = ['$timeout', 'TileModel'];

    function GridService($timeout, Tile) {
        var that = this;

        var SIZE = 4;
        var STARTING_TILE_NUMBER = 1;
        var TOTAL = SIZE * SIZE;
        var vectors = {
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            up: { x: 0, y: -1 }
        }

        this.grid = [];
        this.tiles = [];

        this.newTile = newTile;
        this.moveTile = moveTile;
        this.setCellAt = setCellAt;
        this.getCellAt = getCellAt;
        this.insertTile = insertTile;
        this.removeTile = removeTile;
        this.prepareTiles = prepareTiles;
        this.getEmptyCells = getEmptyCells;
        this.isSamePosition = isSamePosition;
        this.anyCellsAvailable = anyCellsAvailable;
        this.buildEmptyGameBoard = buildEmptyGameBoard;
        this.tileMatchesAvailable = tileMatchesAvailable;
        this.insertNewTileRandomly = insertNewTileRandomly;
        this.buildStartingPosition = buildStartingPosition;
        this.getTraversalDirections = getTraversalDirections;
        this.calculateNextPosition = calculateNextPosition;

        function buildEmptyGameBoard() {
            for (var i = 0; i < TOTAL; i++) {
                that.grid[i] = null;
            }

            forEach(function (x, y) {
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
            if (withinGrid(pos)) {
                var xPos = coordinatesToPosition(pos);
                that.tiles[xPos] = tile;
            }
        }

        function getCellAt(pos) {
            if (withinGrid(pos)) {
                var xPos = coordinatesToPosition(pos);
                return that.tiles[xPos];
            } else {
                return null;
            }
        }

        function isCellEmpty(pos) {
            return getCellAt(pos) == null;
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

            forEach(function (x, y, tile) {
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
                that.insertTile(new Tile(cell, 2));
            }

            return;
        }

        function getTraversalDirections(key) {
            var vector = vectors[key];
            var positions = { x: [], y: [] };

            for (var i = 0; i < SIZE; i++) {
                positions.x.push(i);
                positions.y.push(i);
            }

            if (vector.x > 0) {
                positions.x = positions.x.reverse();
            }

            if (vector.y > 0) {
                positions.y = positions.y.reverse();
            }

            return positions;
        }

        function calculateNextPosition(cell, key) {
            var vector = vectors[key];
            var previous;

            do {
                previous = cell;
                cell = {
                    x: previous.x + vector.x,
                    y: previous.y + vector.y
                };
            } while (withinGrid(cell) && isCellEmpty(cell))

            return {
                newPosition: previous,
                next: getCellAt(cell)
            };
        }

        function moveTile(tile, newPosition) {
            var oldPosition = { x: tile.x, y: tile.y };

            tile.updatePosition(newPosition);

            setCellAt(newPosition, tile);
            setCellAt(oldPosition, null);

        }

        function newTile(position, value) {
            return new Tile(position, value);
        }

        function isSamePosition(initialPosition, newPosition) {
            return initialPosition.x === newPosition.x &&
                   initialPosition.y === newPosition.y;
        }

        function prepareTiles() {
            forEach(function (x, y, tile) {
                if (tile) {
                    tile.reset();
                }
            });
        }

        function anyCellsAvailable() {
            return that.tiles.length < TOTAL ||
                   that.tiles.filter(function (item) {
                       return !!item;
                   }).length !== that.tiles.length;
        }

        function tileMatchesAvailable() {
            for (var i = 0; i < TOTAL; i++) {
                var pos = positionToCoordinates(i);
                var tile = that.tiles[i];

                if (tile) {
                    for (var vectorName in vectors) {
                        if (vectors.hasOwnProperty(vectorName)) {
                            var vector = vectors[vectorName];
                            var cell = { x: pos.x + vector.x, y: pos.y + vector.y };
                            var other = that.getCellAt(cell);
                            if (other && other.value === tile.value) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        };

    }

    function TileModel() {
        return function (pos, val) {
            var that = this;

            this.uid = getUid();
            this.x = pos.x;
            this.y = pos.y;
            this.value = val || 2;
            this.merged = null;

            this.reset = reset;
            this.updatePosition = updatePosition;

            function reset() {
                that.merged = false;
            }

            function updatePosition(newPosition) {
                that.x = newPosition.x;
                that.y = newPosition.y;
            }

            function getUid() {
                return Math.floor(Math.random() * Date.now());
            }
        }
    }

})();