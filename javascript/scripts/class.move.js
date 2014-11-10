function Move(p, col, row, interactedPiece) {
	this.piece = p;
	this.from = [p.col, p.row];
	this.to = [col, row];
	this.interactedPiece = interactedPiece;
};

Move.prototype.displacement = function(colOrRow) {
	var index = colOrRow == "col" ? 0 : 1; 
	return Math.sqrt(Math.pow(this.from[index] - this.to[index], 2));
};

Move.prototype.getAlphaNumericCoord = function() {
	if (this.to[0] == 1) { return "a" + this.to[1]; };
	if (this.to[0] == 2) { return "b" + this.to[1]; };
	if (this.to[0] == 3) { return "c" + this.to[1]; };
	if (this.to[0] == 4) { return "d" + this.to[1]; };
	if (this.to[0] == 5) { return "e" + this.to[1]; };
	if (this.to[0] == 6) { return "f" + this.to[1]; };
	if (this.to[0] == 7) { return "g" + this.to[1]; };
	if (this.to[0] == 8) { return "h" + this.to[1]; };
}

Move.prototype.logText = function() {
	var text = "";
	var symbol = this.piece.originalSymbol() == "P" ? "" : this.piece.originalSymbol();
	if (this.interactedPiece == undefined) {
		return symbol + this.getAlphaNumericCoord();
	}
	else {
		if (this.piece.pieceType == "king") {
			//TODO
			return symbol + this.getAlphaNumericCoord();
		}
		if (this.piece.pieceType == "pawn") {
			//TODO
			return symbol + this.getAlphaNumericCoord();
		}
		else {
			return symbol + "x" + this.getAlphaNumericCoord();
		}
	}
};
