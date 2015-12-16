(function () {

    'use strict';

    angular
        .module('grid', [])
        .service('GridService', GridService)
        .factory('TileModel', TileModel);

    GridService.$inject = ['TileModel'];

    function GridService(Tile) {
        var that = this;

        var GRID_SIZE = 4;
        var STARTING_TILE_NUMBER = 2;
        var TOTAL_TILE_NUMBER = GRID_SIZE * GRID_SIZE;
        var vectors = {
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            up: { x: 0, y: -1 }
        }

        this.tiles = [];

        this.moveTile = moveTile;
        this.getTileAtPosition = getTileAtPosition;
        this.updateTileAtPosition = updateTileAtPosition;
        this.updateTilesState = updateTilesState;
        this.isTileHidden = isTileHidden;
        this.isSamePosition = isSamePosition;
        this.anyHiddenTiles = anyHiddenTiles;
        this.initGameBoard = initGameBoard;
        this.initStartingPosition = initStartingPosition;
        this.activateNewRandomTile = activateNewRandomTile;
        this.tileMatchesAvailable = tileMatchesAvailable;
        this.getTraversalPositions = getTraversalPositions;
        this.calculateNextPosition = calculateNextPosition;

        function initGameBoard() {
            for (var i = 0; i < TOTAL_TILE_NUMBER; i++) {
                var x = i % GRID_SIZE;
                var y = (i - x) / GRID_SIZE;

                that.tiles[i] = new Tile({ x: x, y: y });
            }
        }

        function initStartingPosition() {
            for (var i = 0; i < STARTING_TILE_NUMBER; i++) {
                activateNewRandomTile();
            }
        }

        function activateNewRandomTile() {
            var tile = getRandomHiddenTile();

            if (tile) {
                tile.activateNew();
            }

            return;
        }

        function getTileAtPosition(position) {
            if (isPositionWithinGrid(position)) {
                return that.tiles.filter(function (tile) {
                    return tile.x === position.x && tile.y === position.y;
                })[0];
            } else {
                return null;
            }
        }

        function isTileHidden(tile) {
            return tile == null || tile.isHidden;
        }

        function isPositionWithinGrid(position) {
            return position.x >= 0 && position.x < GRID_SIZE &&
                   position.y >= 0 && position.y < GRID_SIZE;
        }

        function getRandomHiddenTile() {
            var hiddenTiles = getHiddenTiles();

            if (hiddenTiles.length > 0) {
                var randomIndex = Math.floor(Math.random() * hiddenTiles.length);

                return hiddenTiles[randomIndex];
            }

            return null;
        }

        function getHiddenTiles() {
            return that.tiles.filter(function (item) {
                return item.isHidden;
            });
        }

        function updateTileAtPosition(position, value) {
            var tile = getTileAtPosition(position);
            tile.updateValue(value);

            return tile;
        }

        function getTraversalPositions(key) {
            var vector = vectors[key];
            var positions = { x: [], y: [] };

            for (var i = 0; i < GRID_SIZE; i++) {
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

        function calculateNextPosition(tile, key) {
            var vector = vectors[key];
            var previousTile;

            do {
                previousTile = tile;
                tile = getTileAtPosition({
                    x: previousTile.x + vector.x,
                    y: previousTile.y + vector.y
                });
            } while (tile &&
                     isTileHidden(tile) &&
                     isPositionWithinGrid(tile.getPosition()))

            return {
                newPosition: previousTile.getPosition(),
                nextTile: tile
            };
        }

        function moveTile(tile, newPosition, noSwap) {
            var tileAtNewPosition = getTileAtPosition(newPosition);

            if (!noSwap) {
                tileAtNewPosition.setPosition(tile);
            } else {
                tile.hide();
            }

            tile.setPosition(newPosition);
        }

        function isSamePosition(initialPosition, newPosition) {
            return initialPosition.x === newPosition.x &&
                   initialPosition.y === newPosition.y;
        }

        function updateTilesState() {
            that.tiles.forEach(function (tile) {
                tile.updateState();
            });
        }

        function anyHiddenTiles() {
            return getHiddenTiles().length > 0;
        }

        function tileMatchesAvailable() {
            for (var i = 0; i < TOTAL_TILE_NUMBER; i++) {
                var tile = that.tiles[i];

                if (!isTileHidden(tile)) {
                    for (var vectorName in vectors) {
                        if (vectors.hasOwnProperty(vectorName)) {
                            var vector = vectors[vectorName];
                            var neighbourPosition = { x: tile.x + vector.x, y: tile.y + vector.y };
                            var neighbourTile = getTileAtPosition(neighbourPosition);
                            if (!isTileHidden(neighbourTile) && neighbourTile.value === tile.value) {
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
        return function (position, value) {
            var that = this;

            this.uid = getUid();
            this.x = position.x;
            this.y = position.y;
            this.value = value || 2;
            this.previousPosition = null;
            this.isMerged = false;
            this.isHidden = true;

            this.hide = hide;
            this.activateNew = activateNew;
            this.updateValue = updateValue;
            this.updateState = updateState;
            this.getPosition = getPosition;
            this.setPosition = setPosition;

            function hide() {
                that.isHidden = true;
                that.previousPosition = that.getPosition();
            }

            function updateState() {
                that.isMerged = false;
                if (that.previousPosition) {
                    that.setPosition(that.previousPosition);
                    that.previousPosition = null;
                }
            }

            function activateNew() {
                that.value = 2;
                that.isHidden = false;
                that.isMerged = false;
            }

            function updateValue(newValue) {
                that.value = newValue;
                that.isMerged = true;
            }

            function getPosition() {
                return {
                    x: that.x,
                    y: that.y
                }
            }

            function setPosition(newPosition) {
                that.x = newPosition.x;
                that.y = newPosition.y;
            }

            function getUid() {
                return Math.floor(Math.random() * Date.now());
            }
        }
    }

})();