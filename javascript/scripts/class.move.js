function Move(p, col, row, interactedPiece) {
	this.piece = p;
	this.from = [p.col, p.row];
	this.to = [col, row];
	this.interactedPiece = interactedPiece;
};

Move.prototype.displacement = function(colOrRow) {
	var index = colOrRow == "col" ? 0 : 1; 
	return Math.sqrt(Math.pow(this.from[index] - this.to[index], 2));
}