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

	function clearSquares () {
		$(".grid").empty();
	};

	function getPieceFromSquare($square) {
		var col = $square.data("col");
		var row = $square.data("row");
		return getPiece(col, row);
	}

	function getSquareFromPiece(piece) {
		return $("#" + piece.col + "_" + piece.row);
	}

	function drawPieces() {
		$(".grid").empty();
		for (var i = pieces.length - 1; i >= 0; i--) {
			var piece = pieces[i];
			if (piece.live) {
				$("#" + piece.col + "_" + piece.row).append('<div class="piece ' + piece.symbol() + " " + piece.side + '">' + "</div>");
			}
		};
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

	function alertCheck(side) {
		$("#alertBox").empty().append('<div class="alertText">' + side + ' in check!</div>');
		$kingSquare = getSquareFromPiece(getKing(side));
		var flashCount = 0;
		var flash = setInterval(function() {
			$kingSquare.addClass("flashing");
			setTimeout(function() { $kingSquare.removeClass("flashing"); }, 100);
		}, 200);
		setTimeout(function() {
			$(".alertText").fadeOut(1000);
			clearInterval(flash);
		}, 1000);
	}

	function alertCheckmate(side) {
		otherSide = side == "white" ? "black" : "white";
		$("#alertBox").empty().append('<div class="alertText">\
			<div>' + side + ' in checkmate.</div>\
			<div>' + otherSide + ' wins!</div>\
		</div>');

	}
	
	function alertStalemate() {

	}

	function alertDraw() {

	}

	function alertState(side) {
		var k = getKing(side);
		var check = kingInCheck(k, k.col, k.row);
		var legalMoves = filterLegalMoves(k, findAllMoves(k, pieces));
		if (check[side]) {
			if (legalMoves.length > 0) {
				alertCheck(side);
			}
			else {
				alertCheckmate(side);
			}
		}
		else if (!check[side] && legalMoves.length == 0) {
			//missing logic, legalMoves needs to be for ALL pieces
			alertStalemate();
		}
	}

	function resetGame() {
		window.pieces = [];
		window.moves = [];
		window.sideToMove = undefined;
		$("#log").empty();
		createPieces();
		drawPieces();
		updateNextSideToMove();
	}

	//init
	var $boardHolder = $("#boardHolder");
	var $board = $(".board");
	createBoard();
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
					var legalMoves = findAllMoves(piece, pieces);
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

		if (pieceHasMoved) {
			alertState(sideToMove);
		}
	});

	$(document).on("click", ".resetButton", function() {
		resetGame();
	});
});
