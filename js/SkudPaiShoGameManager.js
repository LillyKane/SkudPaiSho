// Skud Pai Sho Game Manager

function SkudPaiShoGameManager(ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = new SkudPaiShoActuator();

	this.tileManager = new SkudPaiShoTileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}

// Set up the game
SkudPaiShoGameManager.prototype.setup = function (ignoreActuate) {

	this.board = new SkudPaiShoBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
SkudPaiShoGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager);
};

SkudPaiShoGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	var errorFound = false;
	var bonusAllowed = false;

	if (move.moveNum === 0 && move.accentTiles) {
		var self = this;
		var allAccentCodes = ['R','W','K','B','R','W','K','B'];
		move.accentTiles.forEach(function(tileCode) {
			var i = allAccentCodes.indexOf(tileCode);
			if (i >= 0) {
				allAccentCodes.splice(i, 1);
			}
		});
		allAccentCodes.forEach(function(tileCode) {
			self.tileManager.grabTile(move.player, tileCode);
		});
		self.tileManager.unselectTiles(move.player);
	} else if (move.moveNum === 1) {
		this.tileManager.unselectTiles(GUEST);
		this.tileManager.unselectTiles(HOST);
	}

	if (move.moveType === PLANTING) {
		// // Check if valid plant
		if (!this.board.pointIsOpenGate(move.endPoint)) {
			// invalid
			debug("Invalid planting point: " + move.endPoint.pointText);
			errorFound = true;
			return false;
		}
		// Just placing tile on board
		var tile = this.tileManager.grabTile(move.player, move.plantedFlowerType);

		this.board.placeTile(tile, move.endPoint);
	} else if (move.moveType === ARRANGING) {
		bonusAllowed = this.board.moveTile(move.player, move.startPoint, move.endPoint);

		if (bonusAllowed && move.hasHarmonyBonus()) {
			var tile = this.tileManager.grabTile(move.player, move.bonusTileCode);
			if (move.boatBonusPoint) {
				this.board.placeTile(tile, move.bonusEndPoint, move.boatBonusPoint);
			} else {
				this.board.placeTile(tile, move.bonusEndPoint);
			}
		} else if (!bonusAllowed && move.hasHarmonyBonus()) {
			debug("BONUS NOT ALLOWED so I won't give it to you!");
			errorFound = true;
		}
	}

	if (withActuate) {
		this.actuate();
	}

	this.endGameWinners = [];
	if (this.board.winners.length === 0) {
		// If no harmony ring winners, check for player out of basic flower tiles
		var playerOutOfTiles = this.aPlayerIsOutOfBasicFlowerTiles();
		if (playerOutOfTiles) {
			debug("PLAYER OUT OF TILES: " + playerOutOfTiles);
			// If a player has more accent tiles, they win
			var playerMoreAccentTiles = this.tileManager.getPlayerWithMoreAccentTiles();
			if (playerMoreAccentTiles) {
				debug("Player has more Accent Tiles: " + playerMoreAccentTiles)
				this.endGameWinners.push(playerMoreAccentTiles);
			} else {
				// Calculate player with most Harmonies
				var playerWithmostHarmonies = this.board.harmonyManager.getPlayerWithMostHarmonies();
				if (playerWithmostHarmonies) {
					this.endGameWinners.push(playerWithmostHarmonies);
					debug("Most Harmonies winner: " + playerWithmostHarmonies);
				} else {
					this.endGameWinners.push(HOST);
					this.endGameWinners.push(GUEST);
					debug("Most Harmonies is a tie!");
				}
			}
		}
	}

	return bonusAllowed;
};

SkudPaiShoGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

SkudPaiShoGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

SkudPaiShoGameManager.prototype.revealOpenGates = function(player, moveNum, ignoreActuate) {
	if (moveNum === 2) {
		// guest selecting first tile
		this.board.setGuestGateOpen();
	} else {
		this.board.setOpenGatePossibleMoves(player);
	}
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

SkudPaiShoGameManager.prototype.playerCanBonusPlant = function(player) {
	if (!newGatesRule) {
		return true;
	}

	if (lessBonus) {
		return this.board.playerHasNoGrowingFlowers(player);
	} else if (limitedGatesRule) {
		// New Gate Rules: Player cannot plant on Bonus if already controlling any Gates
		return this.board.playerHasNoGrowingFlowers(player);
	} else if (newGatesRule) {
		// New Gate Rules: Player cannot plant on Bonus if already controlling two Gates
		return this.board.playerControlsLessThanTwoGates(player);
	}
};

SkudPaiShoGameManager.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

SkudPaiShoGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

SkudPaiShoGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

SkudPaiShoGameManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	return this.tileManager.aPlayerIsOutOfBasicFlowerTiles();
};

SkudPaiShoGameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

SkudPaiShoGameManager.prototype.getWinner = function() {
	if (this.board.winners.length === 1) {
		return this.board.winners[0];
	} else if (this.board.winners.length > 1) {
		return "BOTH players";
	} else if (this.endGameWinners.length === 1) {
		return this.endGameWinners[0];
	} else if (this.endGameWinners.length > 1) {
		return "BOTH players";
	}
};

SkudPaiShoGameManager.prototype.getWinReason = function() {
	if (this.board.winners.length === 1) {
		return " created a Harmony Ring and won the game!";
	} else if (this.endGameWinners.length === 1) {
		if (this.tileManager.getPlayerWithMoreAccentTiles()) {
			return " won the game with more Accent Tiles left.";
		} else {
			return " won the game with the most Harmonies.";
		}
	}
};

SkudPaiShoGameManager.prototype.getWinResultTypeCode = function() {
	if (this.board.winners.length === 1) {
		return 1;	// Harmony Ring is 1
	} else if (this.endGameWinners.length === 1) {
		if (this.tileManager.getPlayerWithMoreAccentTiles()) {
			return 2;	// More Accent Tiles remaining
		} else {
			return 3;	// Most Harmonies
		}
	} else if (this.endGameWinners.length > 1) {
		return 4;	// Tie
	}
};

SkudPaiShoGameManager.prototype.getCopy = function() {
	var copyGame = new SkudPaiShoGameManager(true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
