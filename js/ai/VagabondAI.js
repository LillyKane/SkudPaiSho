// Vagabond AI file

function VagabondAI() {
    this.difficulties = [0, 10, 30, 50];
    this.difficulty = 1;
}

// Required functions

/*
Return the name of this player

Parameters:
None

Returns:
(string): "Vagabond Pai Sho automatic opponent"
*/
VagabondAI.prototype.getName = function() {
    return "Vagabond Pai Sho automatic opponent";
};

/*
I'm not sure what this does.

Parameters:
playerName:

Returns:
None
*/
VagabondAI.prototype.setPlayer = function(playerName) {
    this.player = playerName;
};

/*
Get the next move from this player.

Make a decision about what move to make based on the gamestate and report that move to the game.

Parameters:
game: The current gamestate
moveNum:

Returns:
myMove:
*/
VagabondAI.prototype.getMove = function(game, moveNum) {
    // Get all possible moves
    // Score all moves
    // Sort by score
    // Randomly choose from top $difficulty % moves
    // If winning move available, must take it
      // Except on very low difficulty?
    myMove = null;
    return myMove;
};

// 'Black Box' functions

/*
Generate an integer score for a move.

Return an integer score rating of the 'goodness' of a move. Higher is better.

Parameters:
game:
move:

Returns:
*/
VagabondAI.prototype.scoreMove = function(game, move) {
    if (game.board.winners.includes(this.player)) {
        return Infinity;
    }
    // TODO add more granularity
    return 0;
};

/*
Generate a list of all valid moves.

Parameters:
game:

Returns:
moveset: An array of moves
*/
VagabondAI.prototype.getAllMoves = function(game) {
    moveset = [];
    // TODO lol
    return moveset;
};
