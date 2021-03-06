// Tile Manager

function VagabondTileManager() {
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

VagabondTileManager.prototype.loadTileSet = function(ownerCode) {
	var tiles = [];

	// 2 of each of these tiles
	for (var i = 0; i < 2; i++) {
		tiles.push(new VagabondTile('S', ownerCode));
		tiles.push(new VagabondTile('B', ownerCode));
		tiles.push(new VagabondTile('W', ownerCode));
		tiles.push(new VagabondTile('C', ownerCode));
	}

	// 1 of each of these tiles
	tiles.push(new VagabondTile('L', ownerCode));
	tiles.push(new VagabondTile('F', ownerCode));
	tiles.push(new VagabondTile('D', ownerCode));

	return tiles;
};

VagabondTileManager.prototype.grabTile = function(player, tileCode) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	var tile;
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].code === tileCode) {
			newTileArr = tilePile.splice(i, 1);
			tile = newTileArr[0];
			break;
		}
	}

	if (!tile) {
		debug("NONE OF THAT TILE FOUND");
	}

	return tile;
};

VagabondTileManager.prototype.peekTile = function(player, tileCode, tileId) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	var tile;
	if (tileId) {
		for (var i = 0; i < tilePile.length; i++) {
			if (tilePile[i].id === tileId) {
				return tilePile[i];
			}
		}
	}

	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].code === tileCode) {
			tile = tilePile[i];
			break;
		}
	}

	if (!tile) {
		debug("NONE OF THAT TILE FOUND");
	}

	return tile;
};

VagabondTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

VagabondTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

// VagabondTileManager.prototype.putTileBack = function(tile) {
// 	var player = tile.ownerName;
// 	var tilePile = this.hostTiles;
// 	if (player === GUEST) {
// 		tilePile = this.guestTiles;
// 	}

// 	tilePile.push(tile);
// };

VagabondTileManager.prototype.getCopy = function() {
	var copy = new VagabondTileManager();

	// copy this.hostTiles and this.guestTiles
	
	return copy;
};
