$(document).ready(function(){
	//globals
	window.pieces = [];
	window.moves = [];
	window.sideToMove = undefined;

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

	function logMove(p, col, row, interactedPiece) {
		move = new Move(p, col, row, interactedPiece);
		moves[moves.length] = move;
		$log = $("#log");
		$log.empty();
		for (var i = 0; i < moves.length; i = i + 2) {
			var whiteMove = moves[i];
			var blackMove = moves[i + 1];
			$log.append('<div class="logRow">\
							<div class="inline logCount" data-move="' + i + '">' + parseInt(i / 2 + 1) + '</div>\
							<div class="inline whiteMove" data-move="' + i + '">' + whiteMove.piece.originalSymbol() + '</div>\
						</div>');

			if (!!blackMove) {
				$(".logRow").last().append('<div class="inline blackMove" data-move="' + parseInt(i + 1) + '">' + blackMove.piece.originalSymbol() + '</div>');
			}
		}
	}

	function movePieceTo(piece, col, row) {
		piece.col = col;
		piece.row = row;
		piece.hasMoved = true;
	}

	function getSquareFromPiece(piece) {
		return $("#" + piece.col + "_" + piece.row);
	}

	function moveIsOnBoard(col, row) {
		return col < 9 && col > 0 && row < 9 && row > 0;
	}

	function pieceOn(col, row, pieces) {
		return !!getPiece(col, row, pieces);
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
					var lMoves = findLegalMoves(pieces[i], pieces);
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

	function promotePawns() {
		for (var i = pieces.length - 1; i >= 0; i--) {
			var p = pieces[i];
			if (p.pieceType == "pawn" && (p.row == 1 || p.row == 8)) {
				p.pieceType = "queen";
				drawPieces();
				break;
			}
		}
	}

	function updateNextSideToMove() {
		var toMove = moves.length % 2 == 0 ? "white" : "black";
		$(".titleText").removeClass("toMove");
		$(".titleText." + toMove).addClass("toMove");
		sideToMove = toMove;
	}

	function findLegalMoves(p, pcs) {
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

	function movePieceAndLog($from, $to, piece) {
		var p = getPieceFromSquare($from);
		var t = !!piece ? piece : getPieceFromSquare($to);
		if (p.pieceType == "king" && Math.sqrt(Math.pow(p.col - $to.data("col"), 2)) == 2) {
			if ($to.data("col") - p.col == 2) {
				var r = getPiece(8, p.row);
				logMove(p, $to.data("col"), $to.data("row"), r);
				movePieceTo(p, 7, $to.data("row"));
				movePieceTo(r, 6, $to.data("row"));
			}
			else {
				logMove(p, $to.data("col"), $to.data("row"), r);
				var r = getPiece(1, p.row);
				movePieceTo(p, 3, $to.data("row"));
				movePieceTo(r, 4, $to.data("row"));
			}
		}
		else {
			logMove(p, $to.data("col"), $to.data("row"), t);
			movePieceTo(p, $to.data("col"), $to.data("row"));
		}
	}

	function removePiece($square) {
		getPiece($square.data("col"), $square.data("row")).live = false;
	}

	function drawLegalMoves(p, moves) {
		$(".grid").removeClass("legal");
		for (var i = moves.length - 1; i >= 0; i--) {
			var move = moves[i];
			var check = kingInCheck(p, move[0], move[1]);
			if (!check[p.side]) {
				if (!(p.pieceType == "king" && Math.sqrt(Math.pow(p.col - move[0], 2)) == 2)) {
					if (pieceOn(move[0], move[1], pieces)
					|| (p.pieceType == "pawn" && !pieceOn(move[0], move[1], pieces) && move[0] != p.col)
					) {
						$("#" + move[0] + "_" + move[1]).addClass("attack");
					}
					else {
						$("#" + move[0] + "_" + move[1]).addClass("legal");
					}
				}
				else if (!kingInCheck(p, (move[0] + p.col) / 2, p.row)[p.side]) {
					$("#" + move[0] + "_" + move[1]).addClass("legal");
				}
			}
		}
	}

	function alertSideToMove() {
		$("#alertBox").empty().append('<div class="alertText">' + sideToMove + ' to move!</div>');
		setTimeout(function() {
			$(".alertText").fadeOut(1000);
		}, 1000);
	}

	function alertInCheck(side) {
		var p = pieces[0];
		var check = kingInCheck(p, p.col, p.row);
		if (check[side]) {
			$("#alertBox").empty().append('<div class="alertText">' + side + ' in check!</div>');
			$kingSquare = getSquareFromPiece(getKing(side));
			var flashCount = 0;
			var flash = setInterval(function() {
				$kingSquare.addClass("flashing"); console.log("flash on");
				setTimeout(function() { $kingSquare.removeClass("flashing"); console.log("flash on"); }, 100);
			}, 200);
			setTimeout(function() {
				$(".alertText").fadeOut(1000);
				clearInterval(flash);
			}, 1000);
		}
	}

	function alertCheckmate() {
		$("#alertBox").empty().append('<div class="alertText">' + side + ' in check!</div>');
	}
	
	function alertStalemate() {

	}

	function alertDraw() {

	}

	function resetGame() {
		createBoard();
		createPieces();
		drawPieces();
		updateNextSideToMove();
	}

	//init
	var $boardHolder = $("#boardHolder");
	var $board = $(".board");
	resetGame();

	$(".grid").click(function() {
		$piece = $(this).find(".piece");
		var pieceHasMoved = false;

		if ($piece.length > 0) {
			var sideCanMove = getPieceFromSquare($piece.closest(".square")).side == sideToMove;
			if (!$(this).hasClass("active") && !$(this).hasClass("attack")) {
				if (sideCanMove) {
					$(".grid").removeClass("active legal attack");
					$(this).addClass("active");
					var piece = getPieceFromSquare($piece.closest(".square"));
					var legalMoves = findLegalMoves(piece, pieces);
					drawLegalMoves(piece, legalMoves);			
				}
				else {
					alertSideToMove();
				}

			}
			else if ($(this).hasClass("active")) {
				$(".grid").removeClass("active legal attack");
			}
			else if ($(this).hasClass("attack")) {
				removePiece($(this));
				movePieceAndLog($(".active"), $(this));
				$(".grid").removeClass("active legal attack");
				drawPieces();
				pieceHasMoved = true;
			}
		}
		else if ($(this).hasClass("legal")) {
			movePieceAndLog($(".active"), $(this));
			$(".grid").removeClass("active legal attack");
			drawPieces();
			pieceHasMoved = true;
		}
		else if ($(this).hasClass("attack")) {
			var p = moves[moves.length-1].piece;
			p.live = false;
			movePieceAndLog($(".active"), $(this), p);
			$(".grid").removeClass("active legal attack");
			drawPieces();
			pieceHasMoved = true;
		}
		promotePawns();
		updateNextSideToMove();
		pieceHasMoved ? alertInCheck(sideToMove) : "";
	});
});
