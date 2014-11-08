function moveIsOnBoard(col, row) {
	return col < 9 && col > 0 && row < 9 && row > 0;
}

function kingInCheck(p, pNewCol, pNewRow) {
	var sideInCheck = {	white: false, black: false };
	var oldCol = p.col;
	var oldRow = p.row;
	var pieceOnNewSquare = getPiece(pNewCol, pNewRow, pieces);
	if (!!pieceOnNewSquare) {
		pieceOnNewSquare.live = false;
	}
	p.col = pNewCol;
	p.row = pNewRow;
	var kings = getKings(pieces);

	for (var k = kings.length - 1; k >= 0; k--) {
		var king = kings[k];
		for (var i = pieces.length - 1; i >= 0; i--) {
			if (pieces[i].side != king.side) {
				var lMoves = findAllMoves(pieces[i], pieces);
				for (var j = lMoves.length -1; j >= 0; j--) {
					if (lMoves[j][0] == king.col && lMoves[j][1] == king.row) {
						sideInCheck[king.side] = true;
					}
				}
			}
		}
	}
	p.col = oldCol;
	p.row = oldRow;
	if (!!pieceOnNewSquare) {
		pieceOnNewSquare.live = true;
	}
	return sideInCheck;
}

function filterLegalMoves(p, moves) {
	var legalMoves = [];
	for (var i = moves.length - 1; i >= 0; i--) {
		var move = moves[i];
		var check = kingInCheck(p, move[0], move[1]);
		if (!check[p.side]) {
			if (!(p.pieceType == "king" && Math.sqrt(Math.pow(p.col - move[0], 2)) == 2)) {
				if (pieceOn(move[0], move[1], pieces)
				|| (p.pieceType == "pawn" && !pieceOn(move[0], move[1], pieces) && move[0] != p.col)
				) {
					legalMoves[legalMoves.length] = move;
				}
				else {
					legalMoves[legalMoves.length] = move;
				}
			}
			else if (!kingInCheck(p, (move[0] + p.col) / 2, p.row)[p.side]) {
				legalMoves[legalMoves.length] = move;
			}
		}
	}
	return legalMoves;
}

function findAllMoves(p, pcs) {
	if (!p.live) { return []; }
	var lMoves = [];
	if (p.pieceType == "pawn") {
		var dir = p.side == "white" ? 1 : -1;
		var xy1 = [p.col, p.row + dir];
		var xy2 = [p.col, p.row + 2 * dir];
		var xyAttack = [[p.col + 1, p.row + dir], [p.col - 1, p.row + dir]];

		if (!pieceOn.apply(this, xy1, pcs) && moveIsOnBoard.apply(this, xy1)) {
			lMoves[lMoves.length] = xy1;
		}
		if (!pieceOn.apply(this, xy1, pcs) && !pieceOn.apply(this, xy2, pcs) && moveIsOnBoard.apply(this, xy2) && !p.hasMoved) {
			lMoves[lMoves.length] = xy2;
		}
		if (p.row == 4.5 + 0.5 * dir) {
			var lastM = moves[moves.length - 1];
			if (!!lastM && lastM.piece.pieceType == "pawn"
			&& lastM.displacement("row") == 2
			&& (lastM.to[0] == p.col - 1 || lastM.to[0] == p.col + 1)) {
				lMoves[lMoves.length] = [lastM.to[0], lastM.to[1] + dir];
			}
		}
		for (var i = 0; i < 2; i++) {
			var xy = xyAttack[i];
			if (pieceOn.apply(this, xy, pcs)
			&& getPiece.apply(this, xy, pcs).side != p.side
			&& moveIsOnBoard.apply(this, xy)) {
				lMoves[lMoves.length] = xy;
			}
		}
	}

	if (p.pieceType == "rook" || p.pieceType == "queen") {
		for (var x = p.col - 1; x > 0; x--) {
			var xy1 = [x, p.row];
			if (pieceOn.apply(this, xy1, pcs)) {
				if (getPiece.apply(this, xy1, pcs).side == p.side) { break; } else { lMoves[lMoves.length] = xy1;break; }
			}
			else { lMoves[lMoves.length] = xy1; }
		}
		for (var x = p.col + 1; x < 9; x++) {
			var xy2 = [x, p.row];
			if (pieceOn.apply(this, xy2, pcs)) {
				if (getPiece.apply(this, xy2, pcs).side == p.side) { break; } else { lMoves[lMoves.length] = xy2;break; }
			}
			else { lMoves[lMoves.length] = xy2; }
		}
		for (var y = p.row - 1; y > 0; y--) {
			var xy3 = [p.col, y];
			if (pieceOn.apply(this, xy3, pcs)) {
				if (getPiece.apply(this, xy3, pcs).side == p.side) { break; } else { lMoves[lMoves.length] = xy3;break; }
			}
			else { lMoves[lMoves.length] = xy3; }
		}
		for (var y = p.row + 1; y < 9; y++) {
			var xy4 = [p.col, y];
			if (pieceOn.apply(this, xy4, pcs)) {
				if (getPiece.apply(this, xy4, pcs).side == p.side) { break; } else { lMoves[lMoves.length] = xy4;break; }
			}
			else { lMoves[lMoves.length] = xy4; }
		}
	}

	if (p.pieceType == "bishop" || p.pieceType == "queen") {
		for (var i = 1; moveIsOnBoard(p.col + i, p.row + i); i++) {
			var xy1 = [p.col + i, p.row + i];
			if (pieceOn.apply(this, xy1, pcs)) {
				if (getPiece.apply(this, xy1, pcs).side == p.side) { break; } else { lMoves[lMoves.length] = xy1;break; }
			}
			else { lMoves[lMoves.length] = xy1; }
		}
		for (var i = -1; moveIsOnBoard(p.col + i, p.row + i); i--) {
			var xy2 = [p.col + i, p.row + i];
			if (pieceOn.apply(this, xy2, pcs)) {
				if (getPiece.apply(this, xy2, pcs).side == p.side) { break; } else { lMoves[lMoves.length] = xy2;break; }
			}
			else { lMoves[lMoves.length] = xy2; }
		}
		for (var i = 1; moveIsOnBoard(p.col + i, p.row - i); i++) {
			var xy3 = [p.col + i, p.row - i];
			if (pieceOn.apply(this, xy3, pcs)) {
				if (getPiece.apply(this, xy3, pcs).side == p.side) { break; } else { lMoves[lMoves.length] = xy3;break; }
			}
			else { lMoves[lMoves.length] = xy3; }
		}
		for (var i = -1; moveIsOnBoard(p.col + i, p.row - i); i--) {
			var xy4 = [p.col + i, p.row - i];
			if (pieceOn.apply(this, xy4, pcs)) {
				if (getPiece.apply(this, xy4, pcs).side == p.side) { break; } else { lMoves[lMoves.length] = xy4;break; }
			}
			else { lMoves[lMoves.length] = xy4; }
		}
	}

	if (p.pieceType == "knight") {
		var xyAll = [];
		xyAll[0] = [p.col + 2, p.row + 1];
		xyAll[1] = [p.col + 2, p.row - 1];
		xyAll[2] = [p.col - 2, p.row + 1];
		xyAll[3] = [p.col - 2, p.row - 1];
		xyAll[4] = [p.col + 1, p.row + 2];
		xyAll[5] = [p.col + 1, p.row - 2];
		xyAll[6] = [p.col - 1, p.row + 2];
		xyAll[7] = [p.col - 1, p.row - 2];

		for (var i = xyAll.length - 1; i >= 0; i--) {
			var xy = xyAll[i];
			if ((!pieceOn.apply(this, xy, pcs) || (pieceOn.apply(this, xy, pcs) && getPiece.apply(this, xy, pcs).side != p.side))
				&& moveIsOnBoard.apply(this, xy)) {
				lMoves[lMoves.length] = xy;
			}
		}
	}

	if (p.pieceType == "king") {
		var xyAll = [];
		xyAll[0] = [p.col + 1, p.row];
		xyAll[1] = [p.col - 1, p.row];
		xyAll[2] = [p.col, p.row + 1];
		xyAll[3] = [p.col, p.row - 1];
		xyAll[4] = [p.col + 1, p.row + 1];
		xyAll[5] = [p.col + 1, p.row - 1];
		xyAll[6] = [p.col - 1, p.row + 1];
		xyAll[7] = [p.col - 1, p.row - 1];

		for (var i = xyAll.length - 1; i >= 0; i--) {
			var xy = xyAll[i];
			if ((!pieceOn.apply(this, xy, pcs) || (pieceOn.apply(this, xy, pcs) && getPiece.apply(this, xy, pcs).side != p.side))
				&& moveIsOnBoard.apply(this, xy)) {
				lMoves[lMoves.length] = xy;
			}
		}

		if (!p.hasMoved && !kingInCheck(p, p.col, p.row)[p.side]) {
			var rook1 = getPiece(p.col + 3, p.row);
			var rook2 = getPiece(p.col - 4, p.row);
			if (!pieceOn(p.col + 1, p.row) && !pieceOn(p.col + 2, p.row)
				&& !!rook1 && rook1.pieceType == "rook" && !rook1.hasMoved) {
				lMoves[lMoves.length] = [p.col + 2, p.row];
			}
			if (!pieceOn(p.col - 1, p.row) && !pieceOn(p.col - 2, p.row) && !pieceOn(p.col - 3, p.row)
				&& !!rook2 && rook2.pieceType == "rook" && !rook2.hasMoved) {
				lMoves[lMoves.length] = [p.col - 2, p.row];
			}
		}
	}

	return lMoves;
}