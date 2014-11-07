//pieces
function Piece(pieceType, side, col, row) {
	this.pieceType = pieceType;
	this.originalPieceType = pieceType;
	this.side = side;
	this.col = col;
	this.row = row;
	this.hasMoved = false;
	this.live = true;
};

Piece.prototype.symbol = function() {
	if (this.pieceType == "pawn") { return "P"; }
	if (this.pieceType == "rook") { return "R"; }
	if (this.pieceType == "bishop") { return "B"; }
	if (this.pieceType == "knight") { return "N"; }
	if (this.pieceType == "queen") { return "Q"; }
	if (this.pieceType == "king") { return "K"; }
};

Piece.prototype.originalSymbol = function() {
	if (this.originalPieceType == "pawn") { return "P"; }
	if (this.originalPieceType == "rook") { return "R"; }
	if (this.originalPieceType == "bishop") { return "B"; }
	if (this.originalPieceType == "knight") { return "N"; }
	if (this.originalPieceType == "queen") { return "Q"; }
	if (this.originalPieceType == "king") { return "K"; }
};

Piece.prototype.coord = function() {
	return [this.col, this.row];
}

function createPieces() {
	for (var i = 1; i < 9; i++) {
		pieces[pieces.length] = new Piece("pawn", "white", i, 2);
		pieces[pieces.length] = new Piece("pawn", "black", i, 7);
	}

	pieces[pieces.length] = new Piece("rook", "white", 1, 1);
	pieces[pieces.length] = new Piece("rook", "white", 8, 1);
	pieces[pieces.length] = new Piece("rook", "black", 1, 8);
	pieces[pieces.length] = new Piece("rook", "black", 8, 8);

	pieces[pieces.length] = new Piece("knight", "white", 2, 1);
	pieces[pieces.length] = new Piece("knight", "white", 7, 1);
	pieces[pieces.length] = new Piece("knight", "black", 2, 8);
	pieces[pieces.length] = new Piece("knight", "black", 7, 8);

	pieces[pieces.length] = new Piece("bishop", "white", 3, 1);
	pieces[pieces.length] = new Piece("bishop", "white", 6, 1);
	pieces[pieces.length] = new Piece("bishop", "black", 3, 8);
	pieces[pieces.length] = new Piece("bishop", "black", 6, 8);

	pieces[pieces.length] = new Piece("queen", "white", 4, 1);
	pieces[pieces.length] = new Piece("king", "white", 5, 1);
	pieces[pieces.length] = new Piece("queen", "black", 4, 8);
	pieces[pieces.length] = new Piece("king", "black", 5, 8);

	/////demo

	// pieces[pieces.length] = new Piece("rook", "black", 3, 3);
	// pieces[pieces.length] = new Piece("knight", "black", 4, 2);
	// pieces[pieces.length] = new Piece("king", "white", 7, 3);
	// pieces[pieces.length] = new Piece("queen", "black", 4, 5);
};

function getPieceAndExecute(col, row, func, pcs) {
	var pcs = !!pcs ? pcs : window.pieces;
	for (var i = pcs.length - 1; i >= 0; i--) {
		if (pcs[i].col == col && pcs[i].row == row && pcs[i].live) {
			return func(pcs[i]);
		}
	}
	return undefined;
}

function getPiece(col, row, pieces) {
	function func(piece) {
		return piece;
	}
	return getPieceAndExecute(col, row, func, pieces);
}

function getKings(pcs) {
	var kings = [];
	for (var i = pcs.length - 1; i >= 0; i--) {
		if (pcs[i].pieceType == "king") {
			kings[kings.length] = pcs[i];
		}
	}
	return kings;
}

function getKing(side) {
	for (var i = pieces.length - 1; i >= 0; i--) {
		var p = pieces[i];
		if (p.pieceType == "king" && p.side == side) {
			return p;
		}
	}
}

function movePieceTo(piece, col, row) {
	piece.col = col;
	piece.row = row;
	piece.hasMoved = true;
}

function pieceOn(col, row, pieces) {
	return !!getPiece(col, row, pieces);
}