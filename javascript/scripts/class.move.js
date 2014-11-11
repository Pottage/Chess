function Move(p, col, row, interactedPiece) {
	this.piece = p;
	this.from = [p.col, p.row];
	this.to = [col, row];
	this.interactedPiece = interactedPiece;
	this.logText = this.getLogText();
	this.sideInCheck = undefined;
};

Move.prototype.displacement = function(colOrRow) {
	var index = colOrRow == "col" ? 0 : 1; 
	return Math.sqrt(Math.pow(this.from[index] - this.to[index], 2));
};

Move.prototype.getAlphaNumericCoord = function(coord) {
	return this.getAlphaNumericCol(coord) + coord[1];
}

Move.prototype.getAlphaNumericCol = function(coord) {
	if (coord[0] == 1) { return "a"; };
	if (coord[0] == 2) { return "b"; };
	if (coord[0] == 3) { return "c"; };
	if (coord[0] == 4) { return "d"; };
	if (coord[0] == 5) { return "e"; };
	if (coord[0] == 6) { return "f"; };
	if (coord[0] == 7) { return "g"; };
	if (coord[0] == 8) { return "h"; };
}

Move.prototype.getLogText = function() {
	var text = "";
	var symbol = this.piece.pieceType == "pawn" ? "" : this.piece.originalSymbol();
	if (this.interactedPiece == undefined) {
		return symbol + this.getAlphaNumericCoord(this.to);
	}
	else {
		if (this.piece.pieceType == "king") {
			if (this.to[0] - this.from[0] == 2) {
				return "O-O";
			}
			else if (this.to[0] - this.from[0] == -2) {
				return "O-O-O";
			}
			return symbol + "x" + this.getAlphaNumericCoord(this.to);
		}
		if (this.piece.pieceType == "pawn") {
			if (this.from[0] == this.to[0]) {
				return this.getAlphaNumericCoord(this.to);
			}
			else {
				return this.getAlphaNumericCol(this.from) + this.getAlphaNumericCoord(this.to);
			}
		}
		else {
			return symbol + "x" + this.getAlphaNumericCoord(this.to);
		}
	}
};
