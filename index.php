<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="css/main.css">
		<script type="text/javascript" src="javascript/libs/jquery.js"></script>
		<script type="text/javascript" src="javascript/libs/underscore.js"></script>
		<script type="text/javascript" src="javascript/scripts/class.piece.js"></script>
		<script type="text/javascript" src="javascript/scripts/class.move.js"></script>
		<script type="text/javascript" src="javascript/scripts/gameLogic.js"></script>
		<script type="text/javascript" src="javascript/scripts/board.js"></script>
	</head>
	<body>
		<div id="contentWrapper">
			<div id="logHolder" class="inline">
				<div class="titleWrapper">
						<div class="titleHolder inline">
							<div class="titleText white">White</div>
						</div><!--
						--><div class="lineSpacing inline">|</div><!--
						--><div class="titleHolder inline">
							<div class="titleText black">Black</div>
						</div>
				</div>
				<div id="log"></div>
			</div><!--
			--><div id="boardHolder" class="inline">
				<div class="board"></div>
				<div class="row">
					<div class="square"></div><!--
					--><div class="square xAxis">A</div><!--
					--><div class="square xAxis">B</div><!--
					--><div class="square xAxis">C</div><!--
					--><div class="square xAxis">D</div><!--
					--><div class="square xAxis">E</div><!--
					--><div class="square xAxis">F</div><!--
					--><div class="square xAxis">G</div><!--
					--><div class="square xAxis">H</div>
				</div>
			</div><!--
			--><div id="optionsHolder" class="inline">
				<div id="options">
					<div class="button resetButton">restart</div>
				</div>
				<div id="alertBox"></div>
			</div>
		</div>
	</body>
</html>
