<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Pad Simulator</title>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="http://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
	<link rel="stylesheet" type="text/css" href="pad.css">
	<link rel="shortcut icon" href="http://mtg.dawnglare.com/favicon.ico?v1" />
	<script src="pad.js"></script>
</head>
<body>
	<div id="lineback">
		<button onclick="requestAction('help')" class="topbutton image3">?</button>
		<button onclick="requestAction('options')" class="topbutton image6">Options</button>
		<button onclick="requestAction('damage')" class="topbutton image1">Damage</button>
		<button onclick="requestAction('timer')" class="topbutton image2">Timer</button>
		<div style="float:left;line-height:25px;">Time: <span id="time"></span>&nbsp;</div>
		<button onclick="requestAction('ctimer', 0)" id="image4" style="display:none" class="topbutton image4">Minus</button>
		<button onclick="requestAction('ctimer', 1)" id="image5" style="display:none" class="topbutton image5">Plus</button>
		<div style="float:right;line-height:25px">dawnGlare PAD Simulator</div>
	</div>
	<div id="damage">
		<input id='total' value='Total Damage Dealt' disabled>
		<div id='multic'></div>
	</div>
	<div id="game">
		<div id="board">
			<div id="arrowSurfaceC">
				<canvas id="arrowSurface" width="540px" height="450px"></canvas>
			</div>
			<div id="tiles"></div>
			<button id="showDrops" style="display:none" onclick="requestAction('showdrops')">Show Drops</button>
		</div>
	</div>
	<div id="buttons">
		<button onclick="requestAction('randomize')">Random</button>
		<button onclick="requestAction('loadboard')">Reset</button>
		<button onclick="requestAction('replay')">Replay</button>
		<button onclick="requestAction('copypattern')">Share</button>
		<button onclick="requestAction('changetheworld')">CtW</button>
		<button onclick="requestAction('skyfall')">SkyFall</button>
		<div id="colorchange"><textarea id="entry" maxlength=30></textarea>
		<input type="text" placeholder="H" maxlength="2" id="colorfrom" name="colorfrom">
		<input type="text" placeholder="GB" maxlength="2" id="colorto" name="colorto">
		<br /><button onclick="requestAction('convert')" id="convert">convert</button></div>
	</div>
	<div id="infobooth">
	</div><div id="adunit"><a href='#' onclick="hideUnit('adunit');return false;">Hide Ad</a><br />
		<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
		<!-- pad_footer -->
		<ins class="adsbygoogle"
			 style="display:inline-block;width:320px;height:100px"
			 data-ad-client="ca-pub-8590228402988995"
			 data-ad-slot="1455723262"></ins>
		<script>
		(adsbygoogle = window.adsbygoogle || []).push({});
		</script>
	</div>
	<script src="jquery.ui.touch-punch.min.js"></script>
</body>
</html>