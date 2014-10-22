$(document).ready(function(){
	//globals
	window.pieces = [];

	//board
	function squareParity (col, row) {
		if (row % 2 == col % 2) { return "even"; }
		else { return "odd"; }
	}
	function createBoard() {
		for (var rowNum = 8; rowNum > 0; rowNum--) {
			$board.append('<div class="row" id="row' + rowNum + '"><div class="yAxis square">' + rowNum + '</div></div>');
			var $row = $("#row" + rowNum);

			for (var colNum = 1; colNum < 9; colNum++) {
				$row.append('<div class="square grid ' + squareParity(colNum, rowNum) + '" data-col="' + colNum + '" data-row="' + rowNum + '" id="' + colNum + "_" + rowNum + '"></div>')
			};
		};
	};

	//pieces
	function Piece(pieceType, side, col, row) {
		this.pieceType = pieceType;
		this.side = side;
		this.col = col;
		this.row = row;
		this.coord = [col, row];
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

	function clearSquares () {
		$(".grid").empty();
	};

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
		// pieces[pieces.length] = new Piece("knight", "black", 3, 4);
		// pieces[pieces.length] = new Piece("king", "black", 7, 3);
		// pieces[pieces.length] = new Piece("queen", "black", 4, 5);
	};

	function getPieceAndExecute(col, row, func, copiedPieces) {
		var pcs = !copiedPieces ? pieces : copiedPieces;
		for (var i = pcs.length - 1; i >= 0; i--) {
			if (pcs[i].col == col && pcs[i].row == row && pcs[i].live) {
				return func(pcs[i]);
			}
		}
		return undefined;
	}

	function getPiece(col, row) {
		function func(piece) {
			return piece;
		}
		return getPieceAndExecute(col, row, func);
	}

	function getCopiedPiece(col, row, copiedPieces) {
		function func(piece) {
			return piece;
		}
		return getPieceAndExecute(col, row, func, copiedPieces);
	}

	function getKings(pcs) {
		var kings = [];
		for (var i = pcs.length - 1; i >= 0; i--) {
			if (pcs[i].pieceType	== "king") {
				kings[kings.length] = pcs[i];
			}
		}
		return kings;
	}

	function getPieceFromSquare($square) {
		var col = $square.data("col");
		var row = $square.data("row");
		return getPiece(col, row);
	}

	function getPieceArrayNum(col, row) {
		function func(piece) {
			return pieces.indexOf(piece);
		}
		return getPieceAndExecute(col, row, func);
	}

	function movePieceTo(piece, col, row) {
		piece.col = col;
		piece.row = row;
		piece.coord = [col, row];
		piece.hasMoved = true;
	}

	function getSquareFromPiece(piece) {
		return $("#" + piece.col + "_" + piece.row);
	}

	function moveIsOnBoard(col, row) {
		return col < 9 && col > 0 && row < 9 && row > 0;
	}

	function pieceOn(col, row) {
		return !!getPiece(col, row);
	}

	function drawPieces() {
		$(".grid").empty();
		for (var i = pieces.length - 1; i >= 0; i--) {
			var piece = pieces[i];
			if (piece.live) {
				$("#" + piece.col + "_" + piece.row).append('<div class="piece ' + piece.side + '">' + piece.symbol() + "</div>");
			}
		};
	}

	function KingInCheck(p, pNewCol, pNewRow) {
		var sideInCheck = {	white: false, black: false };
		var newPieces = pieces.slice();
		var cPiece = getCopiedPiece(p.col, p.row, newPieces);
		cPiece.col = pNewCol;
		cPiece.row = pNewRow;
		var kings = getKings(newPieces);

		for (var k = kings.length - 1; k >= 0; k--) {
			for (var i = newPieces.length - 1; i >= 0 && newPieces[i].side != kings[k].side; i--) {
				var lMoves = findLegalMoves(newPieces[i]);
				for (var j = lMoves.length -1; j >= 0; j--) {
					if (lMoves[j] == k.coord) {
						sideInCheck[k.side] = true;
					}
				}
			}
		}
		return sideInCheck;
	}

	function findLegalMoves(p) {
		var lMoves = [];
		if (p.pieceType == "pawn") {
			var dir = p.side == "white" ? 1 : -1;
			var xy1 = [p.col, p.row + dir];
			var xy2 = [p.col, p.row + 2 * dir];
			var xyAttack = [[p.col + 1, p.row + dir], [p.col - 1, p.row + dir]];

			if (!pieceOn.apply(this, xy1) && moveIsOnBoard.apply(this, xy1)) {
				lMoves[lMoves.length] = xy1;
			}
			if (!pieceOn.apply(this, xy1) && !pieceOn.apply(this, xy2) && moveIsOnBoard.apply(this, xy2) && !p.hasMoved) {
				lMoves[lMoves.length] = xy2;
			}
			for (var i = 0; i < 2; i++) {
				var xy = xyAttack[i];
				if (pieceOn.apply(this, xy)
				&& getPiece.apply(this, xy).side != p.side
				&& moveIsOnBoard.apply(this, xy)) {
					lMoves[lMoves.length] = xy;
				}
			}
		}

		if (p.pieceType == "rook" || p.pieceType == "queen") {
			for (var x = p.col - 1; x > 0; x--) {
				var xy1 = [x, p.row];
				if (pieceOn.apply(this, xy1)) {
					if (getPiece.apply(this, xy1).side == p.side) { break; } else { lMoves[lMoves.length] = xy1;break; }
				}
				else { lMoves[lMoves.length] = xy1; }
			}
			for (var x = p.col + 1; x < 9; x++) {
				var xy2 = [x, p.row];
				if (pieceOn.apply(this, xy2)) {
					if (getPiece.apply(this, xy2).side == p.side) { break; } else { lMoves[lMoves.length] = xy2;break; }
				}
				else { lMoves[lMoves.length] = xy2; }
			}
			for (var y = p.row - 1; y > 0; y--) {
				var xy3 = [p.col, y];
				if (pieceOn.apply(this, xy3)) {
					if (getPiece.apply(this, xy3).side == p.side) { break; } else { lMoves[lMoves.length] = xy3;break; }
				}
				else { lMoves[lMoves.length] = xy3; }
			}
			for (var y = p.row + 1; y < 9; y++) {
				var xy4 = [p.col, y];
				if (pieceOn.apply(this, xy4)) {
					if (getPiece.apply(this, xy4).side == p.side) { break; } else { lMoves[lMoves.length] = xy4;break; }
				}
				else { lMoves[lMoves.length] = xy4; }
			}
		}

		if (p.pieceType == "bishop" || p.pieceType == "queen") {
			for (var i = 1; moveIsOnBoard(p.col + i, p.row + i); i++) {
				var xy1 = [p.col + i, p.row + i];
				if (pieceOn.apply(this, xy1)) {
					if (getPiece.apply(this, xy1).side == p.side) { break; } else { lMoves[lMoves.length] = xy1;break; }
				}
				else { lMoves[lMoves.length] = xy1; }
			}
			for (var i = -1; moveIsOnBoard(p.col + i, p.row + i); i--) {
				var xy2 = [p.col + i, p.row + i];
				if (pieceOn.apply(this, xy2)) {
					if (getPiece.apply(this, xy2).side == p.side) { break; } else { lMoves[lMoves.length] = xy2;break; }
				}
				else { lMoves[lMoves.length] = xy2; }
			}
			for (var i = 1; moveIsOnBoard(p.col + i, p.row - i); i++) {
				var xy3 = [p.col + i, p.row - i];
				if (pieceOn.apply(this, xy3)) {
					if (getPiece.apply(this, xy3).side == p.side) { break; } else { lMoves[lMoves.length] = xy3;break; }
				}
				else { lMoves[lMoves.length] = xy3; }
			}
			for (var i = -1; moveIsOnBoard(p.col + i, p.row - i); i--) {
				var xy4 = [p.col + i, p.row - i];
				if (pieceOn.apply(this, xy4)) {
					if (getPiece.apply(this, xy4).side == p.side) { break; } else { lMoves[lMoves.length] = xy4;break; }
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
				if ((!pieceOn.apply(this, xy) || (pieceOn.apply(this, xy) && getPiece.apply(this, xy).side != p.side))
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
				if ((!pieceOn.apply(this, xy) || (pieceOn.apply(this, xy) && getPiece.apply(this, xy).side != p.side))
					&& moveIsOnBoard.apply(this, xy)) {
					lMoves[lMoves.length] = xy;
				}
			}
		}

		return lMoves;
	}

	function movePiece($from, $to) {
		movePieceTo(getPiece($from.data("col"), $from.data("row")), $to.data("col"), $to.data("row"));
	}

	function removePiece($square) {
		getPiece($square.data("col"), $square.data("row")).live = false;

	}

	function drawLegalMoves(moves) {
		$(".grid").removeClass("legal");
		for (var i = moves.length - 1; i >= 0; i--) {
			var move = moves[i];
			if (pieceOn(move[0], move[1])) {
				$("#" + move[0] + "_" + move[1]).addClass("attack");
			}
			else {
				$("#" + move[0] + "_" + move[1]).addClass("legal");
			}
		}
	}

	//init
	var $boardHolder = $("#boardHolder");
	var $board = $(".board");
	createBoard();
	createPieces();
	drawPieces();

	$(".grid").click(function() {
		$piece = $(this).find(".piece");
		if ($piece.length > 0) {
			if (!$(this).hasClass("active") && !$(this).hasClass("attack")) {
				$(".grid").removeClass("active legal attack");
				$(this).addClass("active");
				var legalMoves = findLegalMoves(getPieceFromSquare($piece.closest(".square")))
				drawLegalMoves(legalMoves);
			}
			else if ($(this).hasClass("active")) {
				$(".grid").removeClass("active legal attack");
			}
			else if ($(this).hasClass("attack")) {
				removePiece($(this));
				movePiece($(".active"), $(this));
				$(".grid").removeClass("active legal attack");
				drawPieces();
			}
		}
		else if ($(this).hasClass("legal")) {
			movePiece($(".active"), $(this));
			$(".grid").removeClass("active legal attack");
			drawPieces();
		}
	});
});
