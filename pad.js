var colors = ['blue','green','red','light','dark','heart']
	, colorsbak = ['blue','green','red','light','dark','heart']
	, colors2 = ['blue','green','red','light','dark','heart','poison','jammer']
	, colors3 = ['blue','green','red','light','dark']
	, divs = []
	, savedBoardState = []
	, changeTheWorldOn = 0
	, timerOn = 0
	, dropSpeed = 500
	, scale = 90
	, offsetMargin = 0
	, cornerspace = 20
	, rows = 6, cols = 5
	, scoreTracker = []
	, swapHasHappened = 0
	, timeOut = []
	, ctwTimeOut = []
	, myMonsters = 6
	, freeToPlay = 0
	, skyFall = 0
	, showReplayArrows = 1
	, timerTime = 4000
	, toDrop = 0;

function hideUnit(obj) {
	var link = document.getElementById(obj);
	link.style.display = 'none';
    return false;
}

function toObject(arr){
	var rv = {};
	for (var i = 0; i < arr.length; ++i)
		if (arr[i] !== undefined) rv[i] = arr[i];
	return rv;
}

function inverObject(obj) {
	var result = {};
    for (var key in obj) if (hasOwnProperty.call(obj, key)) result[obj[key]] = key;
    return result;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function convertPosition(x, y){
	return (y*rows+x*1);
}

function convertXY(position, single){
	if (single == 'x') return position%rows;
	if (single == 'y') return Math.floor(position/rows);
	return [position%rows, Math.floor(position/rows)];
}

function randomColor(check){
	var randomIndex;
	if (check == 1) {
		randomIndex = Math.floor(Math.random() * colors3.length);
		return colors[randomIndex];
	}
	else randomIndex = Math.floor(Math.random() * colors.length);
	return colors[randomIndex];
}

jQuery.fn.swap = function(b, trigger){
	b = jQuery(b)[0];
	var a = this[0];
	var t = a.parentNode.insertBefore(document.createTextNode(''), a);
	b.parentNode.insertBefore(a, b);
	t.parentNode.insertBefore(b, t);
	t.parentNode.removeChild(t);
	if (trigger == 2){ // only legit swaps
		if (swapHasHappened == 0) replayMoveSet.push(((b.offsetTop - b.parentNode.offsetTop - offsetMargin)/scale)*6+((b.offsetLeft - b.parentNode.offsetLeft - offsetMargin)/scale));
		replayMoveSet.push(((a.offsetTop - a.parentNode.offsetTop - offsetMargin)/scale)*6+((a.offsetLeft - a.parentNode.offsetLeft - offsetMargin)/scale));
	}
	return this;
};

function displayOutput(content, clear){
	if (typeof clear === "undefined") clear = 0;
	if (clear == 0) document.getElementById("infobooth").innerHTML=content;
	else if (clear == 2) document.getElementById("infobooth").innerHTML=content+document.getElementById("infobooth").innerHTML;
	else document.getElementById("infobooth").innerHTML+=content;
}

function toColor(letter, colorSet){
	letter = letter.toLowerCase();
	if (colorSet == 1) colorSet = colors.slice();
	else colorSet = colors2.slice();
	for (var g=0; g<colors2.length;g++) {
		if (letter == colors2[g].charAt(0)) return colors2[g];
	}
	return 0;
}

function toLetter(color){
	for (var g=0; g<colors2.length;g++) {
		if (color == colors2[g]) return colors2[g].charAt(0);
	}
	return 0;
}

function getTiles(){
	divs = document.getElementsByClassName('tile');
}

function trackScore(matches){
	for (var i=0;i<matches.length;i++) {
		scoreTracker[divs[matches[i][0]].getAttribute('tileColor')].push([matches[i].length]);
	}
}

function clearMemory(item){
	if (item=='score') {
		for (var i=0; i<colors2.length;i++) {
			scoreTracker[colors2[i]] = [];
		}
	}
	if (item=='timeout') {
		for (i = 0; i < timeOut.length; i++) {
			clearTimeout(timeOut[i]);
		}
		timeOut = new Array();
	}
	if (item == 'arrows'){
		document.getElementById("arrowSurface").width = document.getElementById("arrowSurface").width+1;
		document.getElementById("arrowSurface").width = document.getElementById("arrowSurface").width-1;
	}
	if (item == 'ctw'){
		ctwTimeOut = new Array();
	}
}

function capitaliseFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function unCapitaliseFirstLetter(string){
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function toggle(item, command){
	if (item == 'timer'){
		if (timerOn == 0) {
			timerOn = 1;
			displayOutput('Timer starts on click (stays on)<br />');
			reset();
			$("#image4").show();
			$("#image5").show();
			}
		else {
			timerOn = 0;
			displayOutput('Timer off<br />');
			document.getElementById('time').innerHTML = 'Unlimited';
			$("#image4").hide();
			$("#image5").hide();
		}
	}
	if (item == 'damage'){
		if (document.getElementById("damage").style.display == 'none') document.getElementById("damage").style.display = 'block';
		else document.getElementById("damage").style.display = 'none';
	}
	if (item == 'draggable'){
		if (command==2) return $( ".tile" ).draggable( "option", "disabled");
		if (command==1) setTimeout(function(){ $( ".tile" ).draggable( "option", "disabled", false ); }, 5);
		else setTimeout(function(){ $( ".tile" ).draggable( "option", "disabled", true ); }, 5);
	}
	if (item == 'skyfall'){
		if (skyFall == 0) {
			skyFall = 1;
			displayOutput('Skyfall (and extra turns) On');
			}
		else {
			skyFall = 0;
			displayOutput('Skyfall (and extra turns) Off');
			}
		}
	if (item == 'boardcolor'){
		temp23 = '';
		var index;
		for (index = 0; index < colors.length; ++index) {
			if (capitaliseFirstLetter(colors[index]) == command){
				temp23 = '1';
				colors.splice(index, 1);
				break;
			}
		}
		if (temp23 != '1') colors.push(unCapitaliseFirstLetter(command));
		document.getElementById('bc'+command).style.backgroundImage = "url('http://pad.dawnglare.com/"+command+temp23+".png')";
	}
	if (item == 'replayarrows'){
		if (command == 0){
			showReplayArrows = 0;
			displayOutput('Replay Arrows Off');
		}
		else {
			showReplayArrows = 1;
			displayOutput('Replay Arrows On');
		}
	}
}

function setTileAttribute(i, tileColor, opacity, classless){
	if (classless!=1) divs[i].setAttribute('class', 'tile '+tileColor);
	divs[i].setAttribute('tileColor', tileColor);
	divs[i].setAttribute('style', 'opacity:'+opacity);
}

function randomizeBoard(){
	for(var i = 0; i < rows*cols; i++){
		setTileAttribute(i, randomColor(), 1);
	}
	getTiles();
	var matchedOrbs = getMatches();
	if (matchedOrbs != false) randomizeBoard();
}

function saveBoardState(){
	for(var i = 0; i < divs.length; i++){
		savedBoardState[i] = divs[i].getAttribute('tileColor');
	}
}

function loadBoardState(loadThis){
	for(var i = 0; i < divs.length; i++){
		setTileAttribute(i, loadThis[i], 1);
	}
	getTiles();
}

function opacify(){
	for(var i = 0; i < divs.length; i++){
		divs[i].setAttribute('style', 'opacity:1');
	}
}

function applyPattern(){
	var input = document.getElementById("entry").value;
	input = input.replace(new RegExp('\r?\n','g'), '');
	if (input.length != rows*cols) return false;
	var tileColor;
	for(var i = 0; i < rows*cols; i++){
		tileColor = toColor(input[i]);
		if (tileColor == 0) return false;
    }
	for(var i = 0; i < rows*cols; i++){
		tileColor = toColor(input[i]);
		setTileAttribute(i, tileColor, 1);
	}
	return true;
}

function copyPattern(modifier){
	var tilePattern = '';
	for(var i = 0; i < rows*cols; i++){
		if (toLetter(divs[i].getAttribute('tileColor')) == 0) return false;
		tilePattern += toLetter(divs[i].getAttribute('tileColor')).toUpperCase();
	}
	document.getElementById("entry").value = tilePattern;
	displayOutput("<a href='http://pad.dawnglare.com/?patt="+tilePattern+"'>Pattern Link</a><br />", modifier);
	if (replayMoveSet.length > 0) {
		displayOutput("<a href='http://pad.dawnglare.com/?patt="+tilePattern+"&replay="+replayMoveSet.join('|')+"'>Pattern with Replay Link</a>", 1);
		displayOutput("<br /><a href='http://pad.dawnglare.com/?patt="+tilePattern+"&replay="+replayMoveSet.join('|')+"&drops=1'>Pattern with Replay with Drops Link</a>", 1);
	}
}

function darkenOrbs (matchedOrbs){
    var comboPositionSplit = matchedOrbs[Object.size(matchedOrbs)-1];
		for(var i = 0; i < comboPositionSplit.length; i++){
			setTileAttribute(comboPositionSplit[i], 'black', 0, 1);
		}
	delete matchedOrbs[Object.size(matchedOrbs)-1];
	timeOut.push(setTimeout(function () {
		if (Object.size(matchedOrbs) > 0) darkenOrbs (matchedOrbs);
		else requestAction('boardmatched');
	}, dropSpeed));
}

function changeTheWorld(){
	changeTheWorldOn = 1;
	if (freeToPlay != 1){
		start();
		ctwTimeOut.push(setTimeout(function(){
			replayMoveSet=[];
			$(document).trigger("mouseup");
			swapHasHappened = 1;
			changeTheWorldOn = 0;
			requestAction('solve', 1);
		},10000));
	}
}

function checkField(){
	for(var f = 0; f < rows; f++){
		var comboCount = 0;
		for(var i = 0+f; i < rows*cols; i=i+rows){
			if (divs[rows*cols-1-i].getAttribute("tileColor") == 'black') comboCount++;
			else if (comboCount > 0) {
				return true;
			}
		}
	}
	return false;
}

function dropField(){
	for(var f = 0; f < rows; f++){
		for(var i = 0+f; i < rows*cols; i=i+rows){
			if (i < rows*(cols-1)) {
				if (divs[rows*cols-1-i].getAttribute("tileColor") == 'black'){
					($(divs[rows*cols-1-i])).swap($(divs[rows*cols-1-i-rows]));
				}
			}
			else {
				if (divs[rows*cols-1-i].getAttribute("tileColor") == 'black'){
					if (skyFall == 1) setTileAttribute(rows*cols-1-i, randomColor(), 1);
				}
			}
		}
	}
	if (checkField()) timeOut.push(setTimeout(function () { dropField(); }, 100));
	else requestAction('fielddropped');
}

function showDrops() {
	$("#showDrops").hide();
	timeOut.push(setTimeout(function () {
		swapHasHappened = 1;
		clearMemory('arrows');
		opacify();
		requestAction('solve', 1);
	}, dropSpeed));
}

var replayMoveSet=[];
function playReplay(solution){
	if (replayMoveSet.length == 0 || changeTheWorldOn == 1){ return; }
	requestAction('loadboard');
	toggle('draggable', 0);
	var ctx = document.getElementById("arrowSurface").getContext("2d");
	($(divs[replayMoveSet[0]])).css({ opacity:0.4 });
	console.log(replayMoveSet.join(','));
	var i=1;
	function playReplayLoopF () {
		timeOut.push(setTimeout(function () {
			var special = 0;
			for (var f=1;f<i+1;f++){
				if (f==i) special=1;
				if (showReplayArrows == 1) canvas_arrow(ctx,convertXY(replayMoveSet[f-1], 'x')*scale+scale/2, convertXY(replayMoveSet[f-1], 'y')*scale+scale/2, convertXY(replayMoveSet[f], 'x')*scale+scale/2, convertXY(replayMoveSet[f], 'y')*scale+scale/2, special);
			}
			($(divs[replayMoveSet[i-1]])).swap($(divs[replayMoveSet[i]]));
			i++;
			if (i < replayMoveSet.length) playReplayLoopF();
			else {
				if (solution == 2){
					showDrops();
				}
				else {
					$("#showDrops").show();
				}
			}
		}, dropSpeed));
	}
	playReplayLoopF ();
}

function canvas_arrow(ctx, fromx, fromy, tox, toy, special){
	fromx+=0.5;
	fromy+=0.5;
	tox+=0.5;
	toy+=0.5;
	var dx = tox-fromx;
	var dy = toy-fromy;
	var angle = Math.atan2(dy,dx);
	var headlen = 25;
	
	ctx.strokeStyle="black";
	ctx.lineWidth="12";
	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo((tox-fromx)*0.88+fromx, (toy-fromy)*0.88+fromy);
	ctx.stroke();
	
	if (special==1) ctx.fillStyle="#cf0";
	else ctx.fillStyle="white";
	headlen = 22;
	ctx.beginPath();
	ctx.moveTo(tox, toy);
	ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
	ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
	ctx.closePath();
	ctx.lineWidth="5";
	ctx.stroke();
	ctx.fill();
	
	
	if (special==1) ctx.strokeStyle="#cf0";
	else ctx.strokeStyle="white";
	ctx.lineWidth="8";
	ctx.beginPath();
	ctx.moveTo(tox-(tox-fromx)*0.98, toy-(toy-fromy)*0.98);
	ctx.lineTo((tox-fromx)*0.88+fromx, (toy-fromy)*0.88+fromy);
	ctx.stroke();
}

function getMatches(){
	var comboPositionList = [];
	var comboColor = '', comboPosition = [];
	for(var f = 0; f < cols; f++){
		comboColor = ''; comboPosition = [];
		for(var i = f*rows; i < f*rows+rows; i++){
			if (divs[i].getAttribute("tileColor") != comboColor){
				if (comboPosition.length > 2){
					comboPositionList = comboPositionList.concat(comboPosition);
				}
				comboColor = divs[i].getAttribute("tileColor");
				comboPosition.length = 0;
			}
			comboPosition.push(i);
			if (comboPosition.length > 2 && i == f*rows+cols){
				comboPositionList = comboPositionList.concat(comboPosition);
			}
		}
	}
	for(var f = 0; f < rows; f++){
		comboColor = ''; comboPosition = [];
		for(var i = 0+f; i < rows*cols; i=i+rows){
			if (divs[i].getAttribute("tileColor") != comboColor){
				if (comboPosition.length > 2){
					comboPositionList = comboPositionList.concat(comboPosition);
				}
				comboColor = divs[i].getAttribute("tileColor");
				comboPosition.length = 0;
			}
			comboPosition.push(i);
			if (comboPosition.length > 2 && i > rows*(cols-1)-1){
				comboPositionList = comboPositionList.concat(comboPosition);
			}
		}
	}
	if (comboPositionList.length == 0) return false;
	comboPositionList = toObject(comboPositionList);
	var comboTracker = jQuery.extend({},inverObject(comboPositionList));
	var stack = [], solutions = [], track = [];
	for (var i=0;i<Object.size(comboPositionList);i++){ track = [];
		if (typeof comboTracker[comboPositionList[i]] === "undefined") continue;
		comboColor = divs[comboPositionList[i]].getAttribute('tileColor');
		if (comboColor == 'black') continue;
		floodFill.apply(null, convertXY(comboPositionList[i]));
		solutions.push(track);
	} return solutions;
	function floodFill(x, y){
		fillPosition (x, y);
		while(stack.length>0){
			var toFill = stack.pop();
			fillPosition(toFill[0], toFill[1]);
		}
	}
	function fillPosition (x, y){
		if(!alreadyFilled(x, y)) {
			delete comboTracker[convertPosition(x, y)];
			track.push(convertPosition(x, y));
		}
		if(!alreadyFilled(x, y-1)) stack.push([x, y-1]);
		if(!alreadyFilled(x+1, y)) stack.push([x+1, y]);
		if(!alreadyFilled(x, y+1)) stack.push([x, y+1]);
		if(!alreadyFilled(x-1, y)) stack.push([x-1, y]);
	}
	function alreadyFilled(x, y){
		if (x<0 || y<0 || x>rows-1 || y>cols-1) return true;
		if (typeof comboTracker[convertPosition(x, y)] === "undefined") return true;
		if (divs[convertPosition(x, y)].getAttribute('tileColor') != comboColor) return true;
	return false;
	}
}

function createMonsters(){ // SOMETHING SOMETHING
	toLetter(randomColor());
	var damageZones;
		damageZones = document.createElement("input");
		damageZones.setAttribute('type', 'text');
		damageZones.setAttribute('id', 'multi');
		damageZones.setAttribute('title', 'Combined Multiplier');
		$('#multic').append(damageZones);
	
	for(var i = 0; i < myMonsters; i++){
		damageZones = document.createElement("div");
		damageZones.setAttribute('id', 'm'+i);
		damageZones.setAttribute('class', 'monster');
		$('#damage').append(damageZones);
	}
	for(var i = 0; i < myMonsters; i++){
		damageZones = document.createElement("input");
		damageZones.setAttribute('type', 'text');
		damageZones.setAttribute('id', 't'+i);
		damageZones.setAttribute('class', 'mtypes');
		damageZones.setAttribute('maxlength', 2);
		damageZones.setAttribute('title', toLetter(randomColor(1)).toUpperCase()+toLetter(randomColor(1)).toUpperCase());
		$('#m'+i).append(damageZones);
	}
	for(var i = 0; i < myMonsters; i++){
		damageZones = document.createElement("input");
		damageZones.setAttribute('type', 'text');
		damageZones.setAttribute('id', 'd'+i);
		damageZones.setAttribute('title', '1000');
		damageZones.setAttribute('class', 'mnums');
		damageZones.setAttribute('maxlength', 4);
		$('#m'+i).append(damageZones);
	}	
	for(var i = 0; i < myMonsters; i++){
		damageZones = document.createElement("input");
		damageZones.setAttribute('type', 'text');
		damageZones.setAttribute('id', 'r'+i);
		damageZones.setAttribute('disabled', true);
		$('#m'+i).append(damageZones);
	}
	document.getElementById("damage").style.display = 'none';
}



function calculateOutput(item){ // DAMAGE CALC OPTIMIZATINO // XX COMBO AND XX COLORS
	var temp;
	
	if (item == 'score'){
		var totalCombo = 0;
		var comboText = '';
		for (i = 0; i<colors2.length;i++){
			if (typeof scoreTracker[colors2[i]] === "undefined") continue;
			for (g = 0;g<scoreTracker[colors2[i]].length;g++){
				comboText += scoreTracker[colors2[i]][g]+" x "+colors2[i]+'<br />';
				totalCombo++;
			}
		}
		var poisonText = '';
		var numberOfMoves = '';
		var poisonAmount = 0;
		for (var i=0;i<scoreTracker['poison'].length;i++){
			poisonAmount += 20+(scoreTracker['poison'][i]-3)*5;
		}
		if (scoreTracker['poison'].length>0) poisonText = poisonAmount+'% life lost due to poison';
		if (replayMoveSet.length > 0) numberOfMoves = 'Number of moves: '+(replayMoveSet.length-1);
		displayOutput('<div style="float:left">'+comboText+'</div><div style="float:left;margin-left:20px">Total Combo: '+totalCombo+'<br />'+numberOfMoves+'<br />'+poisonText+'</div>', 0);
	}
	if (item == 'damage'){
		var scorePerColor = [];
		var doItComboCount2 = 0;
		for (var i = 0; i<colors2.length;i++){
			if (typeof scoreTracker[colors2[i]] === "undefined") continue;
			for (var g = 0;g<scoreTracker[colors2[i]].length;g++){
				if (typeof scorePerColor[colors2[i]] === "undefined") scorePerColor[colors2[i]] = 0;
				scorePerColor[colors2[i]] += (100+(scoreTracker[colors2[i]][g]*1-3)*25)/100;
				doItComboCount2++;
			}
		}
		var damageTotal = 0, multiNum;
		scorePerColor['x']=0;
		if (!($.isNumeric(multiNum = document.getElementById("multi").value))) multiNum = 0;
		var dmgColor, temp = 0, dmgColor2, damageCounter;
		for (var i=0;i < myMonsters;i++){
			damageCounter = 0;
			var temp2 = document.getElementById("t"+i).value.trim().split('');
			for (var f=0;f <2;f++){
				if (typeof temp2[f] === "undefined") { dmgColor = 'x'; }
				else dmgColor = toColor(temp2[f], 1);
				if (f==0){
					if (dmgColor == 'x' || !($.isNumeric(document.getElementById("d"+i).value*1))) break;
					if (!isNaN(scorePerColor[dmgColor])) damageCounter = document.getElementById("d"+i).value*1 * scorePerColor[dmgColor];
					dmgColor2 = dmgColor;
				}
				if (f==1){
				temp = 0.3;
				if (dmgColor == dmgColor2) { temp = 0.1; }
				if (isNaN(scorePerColor[dmgColor])) scorePerColor[dmgColor] = 0;
				damageCounter = multiNum*((100+(doItComboCount2-1)*25)/100)*(damageCounter + temp*Math.ceil((document.getElementById("d"+i)).value) * scorePerColor[dmgColor]);
				if (isNaN(damageCounter)) damageCounter = 0;
				if (damageCounter > 999999) document.getElementById("r"+i).value = Math.ceil(damageCounter/10000)/100+"m";
				else document.getElementById("r"+i).value = Math.ceil(damageCounter);
				damageTotal += Math.ceil(damageCounter);
				}
			}	
		}
		document.getElementById("total").value = 'Total Damage Dealt: '+damageTotal;
	}
}



function solveBoard(solvePortion){
	if (solvePortion == 1){
		getTiles();											// get board positions
		var matchedOrbs = getMatches();
		if (matchedOrbs != false){							// find matches
			trackScore(matchedOrbs);						// track score
			darkenOrbs(matchedOrbs);						// clear matches
		}
		else {
				calculateOutput('score');
				calculateOutput('damage');
				swapHasHappened = 0;
				clearMemory('timeout');
			if (skyFall == 1) toggle('draggable', 1);
		}
	}
	if (solvePortion == 2) {
		timeOut.push(setTimeout(function () { requestAction('solve'); }, dropSpeed));
	}
}

function changeTimer (modifier){
	if (modifier == 0) {
		if (timerTime > 0) timerTime = timerTime - 500;
	}
	else timerTime = timerTime + 500;
	console.log(timerTime);
	reset();
}

function requestAction(action, modifier){ // CLEAN IT UP
	if(typeof modifier === 'undefined') modifier = 0;
	if (action == 'randomize' || (action == 'applypattern' && modifier != 2)) replayMoveSet=[];
	if (action == 'randomize' || action == 'loadboard' || action == 'clearstate' || action == 'copypattern') {
		toggle('draggable', 1);
		changeTheWorldOn = 0;
		swapHasHappened = 0;
		clearMemory('timeout');
		clearMemory('ctw');
		reset();
		clearMemory('arrows');
		$("#showDrops").hide();
	}
	if (action == 'randomize') {
		if (colors.length < 2) displayOutput('Select a minimum of 2 colors in the options to randomize the board<br />', 0);
		else {
			randomizeBoard();
			saveBoardState();
			requestAction('copypattern');
		}
	}
	if (action == 'loadboard') loadBoardState(savedBoardState);
	if (action == 'timer') {
		if (changeTheWorldOn == 0) toggle('timer');
		else displayOutput('Not during Change the World<br />', 0);
		}
	if (action == 'damage') toggle('damage');
	if (action == 'skyfall') toggle('skyfall');
	if (action == 'changetheworld') {
		if (!toggle('draggable', 2)) {
			changeTheWorld();
			displayOutput('I want to change the world... <br />', 0);
		}
		else displayOutput('Reset the board first<br />', 0);
	}
	if (action == 'applypattern') {
		if (applyPattern()) {
			toggle('draggable', 1);
			saveBoardState();
			requestAction('copypattern' , 0);
		}
		else displayOutput('Failed to Apply<br />', 0);
	}
	if (action == 'copypattern') {
		loadBoardState(savedBoardState);
		copyPattern(modifier);
	}
	if (action == 'solve') {
		if (changeTheWorldOn == 0) reset();
		if (modifier==1) {
			clearMemory('score');
			}
		if (changeTheWorldOn == 0 && swapHasHappened) {
			toggle('draggable', 0);
			solveBoard(1);
		}
		else {
			clearMemory('timeout');
		}
		if (modifier==3) {//GET RID OF THIS
			clearMemory('arrows');
			swapHasHappened = 1;
			solveBoard(1);
		}
	}
	if (action == "convert"){
		if ((swapHasHappened == 0 || skyFall == 1) && (timeOut.length < 1)){
			var colorfrom = document.getElementById("colorfrom").value;
			var colorto = document.getElementById("colorto").value;
			if (colorfrom.length < 1 || colorto.length < 1 || colorfrom.length != colorto.length) return;
			saveBoardState();
			requestAction('copypattern');
				var inputtemp = document.getElementById("entry").value;
				inputtemp = inputtemp.replace(new RegExp('\r?\n','g'), '');
				var temp3 = inputtemp.split("");
				for (var i = 0, len = inputtemp.length; i < len; i++) {
					for (var g = 0, len2 = colorfrom.length; g < len2; g++) {
						if (capitaliseFirstLetter(inputtemp[i]) == capitaliseFirstLetter(colorfrom[g])){
							//temparray = colorto.split('');
							//tempcolor = temparray[Math.floor(Math.random() * temparray.length)];
							temp3[i] = capitaliseFirstLetter(colorto[g]);
							continue;
						}
					}
				}
				document.getElementById("entry").value = temp3.join("");
				requestAction('applypattern');
		}
	}
	if (action == 'boardmatched') dropField();
	if (action == 'solve2' || action == 'fielddropped') solveBoard(2);
	if (action == 'help') {
		var showHelp = 
			['<a href="javascript:requestAction(\'legend\')">Legend</a> for the color entry box on the right<br /><br />Damage (sword icon): Types (colors) are entered by their initials (same as legend)',
			'<br /><br />Timer (stopwatch icon): toggles a 4 second timer<br /><br />Replay: Does not save during Change the World<br /><br />',
			'CtW (change the world): move and drop orbs freely for 10 seconds<br /><br />Skyfall: causes random orbs to fall and adds multiple turns<br /><br />Gear has options (board colors for random/skyfall)',
			'<br /><br />Convert: LD DL would change Light orbs to Dark and Dark orbs to Light (max 2 characters, First changes to First, Second to Second)',
			'<br /><br />Contact me with suggestions at contact@dawnglare.com : <a href="https://github.com/dawnGlare/padsim">GitHub link</a>'
			].join('');
		displayOutput(showHelp, 0);
	}
	if (action == 'options') {
		var showHelp = 
			['Options:<br /><div class="test1"><div style="float:left;vertical-align:bottom;line-height:30px">Board Colors: </div>',
			'<button onclick="requestAction(\'boardcolor\', \'Green\')" id="bcGreen" class="topbutton image7">Options</button>',
			'<button onclick="requestAction(\'boardcolor\', \'Red\')" id="bcRed" class="topbutton image8">Options</button>',
			'<button onclick="requestAction(\'boardcolor\', \'Blue\')" id="bcBlue" class="topbutton image9">Options</button>',
			'<button onclick="requestAction(\'boardcolor\', \'Light\')" id="bcLight" class="topbutton image10">Options</button>',
			'<button onclick="requestAction(\'boardcolor\', \'Dark\')" id="bcDark" class="topbutton image11">Options</button>',
			'<button onclick="requestAction(\'boardcolor\', \'Heart\')" id="bcHeart" class="topbutton image12">Options</button></div>',
			'<br />Replayarrows: <a id="myLink" title="toggle replay" href="#" onclick="requestAction(\'replayarrows\', \'1\');">On</a> / <a id="myLink" title="toggle replay" href="#" onclick="requestAction(\'replayarrows\', \'0\');">Off</a>'
			].join('');
		displayOutput(showHelp, 0);
		for (index1 = 0; index1 < 2; ++index1){
			toggle('boardcolor', 'Blue');
			toggle('boardcolor', 'Green');
			toggle('boardcolor', 'Red');
			toggle('boardcolor', 'Light');
			toggle('boardcolor', 'Dark');
			toggle('boardcolor', 'Heart');
		}
		console.log(colors);
	}
	if (action == 'boardcolor') toggle('boardcolor', modifier);
	if (action == 'legend') {
		var showHelp = 
			['Legend:<br />R = Red<br />B = Blue<br />G = Green<br />D = Dark (Purple)<br />L = Light (Yellow)<br />H = Heart<br />J = Jammer<br />P = Poison',
			'<br /><br />Press Enter to change the board'
			].join('');
		displayOutput(showHelp, 0);
	}
	if (action == 'replay') playReplay(toDrop);
	if (action == 'showdrops') showDrops();
	if (action == 'ctimer' && changeTheWorldOn == 0) {
		changeTimer(modifier);
	}
	if (action == 'replayarrows') toggle('replayarrows', modifier);
	
}

	//for(key in comboTracker){ if(comboTracker.hasOwnProperty(key)){ console.log("key = " + key + ", value = " + comboTracker[key]); }}
	//if (replayMoveSet.length != 0) document.getElementById("infobooth").innerHTML="Copied to Box!<br /><br />Pattern: <a href='http://pad.dawnglare.com/?patt="+tileColorPatt+"'>Link</a><br />+Replay: <a href='http://pad.dawnglare.com/?patt="+tileColorPatt+"&replay="+replayMoveSet.join('|')+"'>Link</a><br /><br />"+legendAry;


var	clsStopwatch = function() {
	var	startAt	= 0;
	var	lapTime	= 0;
	var	now	= function() {
		return (new Date()).getTime();
	};
	this.start = function() {
		startAt	= startAt ? startAt : now();
	};
	this.reset = function() {
		lapTime = startAt = 0;
	};
	this.time = function() {
		return lapTime + (startAt ? now() - startAt : 0);
	};
};
var x = new clsStopwatch();
var clocktimer;
function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}
function formatTime(time, modifier) {
	if(typeof modifier === 'undefined') modifier = 0;
	var s = ms = 0
	, newTime = ''
	, timeTop;
	time = time % (60 * 60 * 1000);
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;
	if (!timerOn && !changeTheWorldOn) return 'Unlimited';
	if (timerOn == 1) timeTop = timerTime/1000;
	if (changeTheWorldOn == 1) timeTop = 10;
	newTime = pad(Math.floor(timeTop - .01) - s, 2)+'.' + pad(1000 + timerTime - Math.floor(timerTime/1000)*1000 - ms, 3)+'s';
	if (modifier == 1) newTime = pad(Math.floor(timeTop) - s, 2) + '.' + pad(1000 + timerTime - Math.floor(timerTime/1000)*1000 - ms, 3)+'s';
	return newTime;
}
function update() {
	document.getElementById('time').innerHTML = formatTime(x.time());
}
function start() {
	clocktimer = setInterval("update()", 1);
	x.start();
}
function reset() {
	clearInterval(clocktimer);
	x.reset();
	update();
	document.getElementById('time').innerHTML = formatTime(x.time(), 1);
}


$(function(){		// CURSOR AT AND MOVING ORB SIZE

	for(var i = 0; i < rows*cols; i++){				// create board
		var randColor = randomColor();
		divs[i] = document.createElement("div");
		setTileAttribute(i, randColor, 1);
		$('#tiles').append(divs[i]);
	}
	for (i = 1; i < rows; i++) {
		for (h = 1; h < cols; h++) {
		  $( "#board" ).append( "<div class='cornerblock' style='left:"+((scale*i)-(cornerspace/2))+"px;top:"+((scale*h)-(cornerspace/2))+"px'></div>" );
		}
	}
	randomizeBoard();
	
	createMonsters();
	saveBoardState();
	clearMemory('score');
	var $_GET = {}, args = location.search.substr(1).split(/&/);
	for (var i=0; i<args.length; ++i) { // GET reader
		var tmp = args[i].split(/=/);
		if (tmp[0] != "") {
			$_GET[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
		}
	}
	if ($_GET['patt']){
		document.getElementById("entry").innerHTML=$_GET['patt'];
		if ($_GET['replay']){
			replayMoveSet=$_GET['replay'].split('|');
			for (i=0;i<replayMoveSet.length;i++){
				if (replayMoveSet[i] > 29 || replayMoveSet[i] < 0) {
					replayMoveSet = [];
					break;
				}
			}
		}
		requestAction('applypattern', 2);
	}
	else requestAction('copypattern' , 0);
	if (replayMoveSet.length > 0) timeOut.push(setTimeout(function () { requestAction('replay'); }, 1000));
	if ($_GET['freetoplay']) freeToPlay=1;
	if ($_GET['timer']) timerTime=$_GET['timer']*1000;
	if ($_GET['drops']) toDrop = 2;
	if ($_GET['speed'] && $.isNumeric($_GET['speed'])) dropSpeed = $_GET['speed'];
	requestAction('help');
	
	$(function(){
		document.getElementById('time').innerHTML = formatTime(x.time());
	});

	$( ".tile" ).draggable({
		refreshPositions:"true",
		containment: "#board",
		helper: "clone",
		opacity: 0.8,
		start:function( event, ui ){
			$(this).css({ opacity:0.2 });
			clearMemory('arrows');
			replayMoveSet=[];
			if (changeTheWorldOn ==0 && timerOn == 1) {
				timeOut.push(setTimeout(function(){ $(document).trigger("mouseup"); },timerTime));
				start();
			}
		},
		stop:function( event, ui ){
			$(this).css({ opacity:1 });
			requestAction('solve', 1);
		},
		cursorAt: { top: scale/2, left: scale/2 }
	});
	$( ".tile" ).droppable({
		tolerance: "pointer",
		accept: ".tile",
		over: function( event, ui ){
			var draggable = ui.draggable, droppable = $(this);
			if (skyFall == 1 && swapHasHappened == 0) saveBoardState();
			draggable.swap(droppable, 2);
			swapHasHappened = 1;
		}
	});
	$( ".cornerblock" ).droppable({
		tolerance: "pointer",
		over: function( event, ui ) {
			var cornerblockcount = 0;
			$( ".tile" ).each(function() {
				if (cornerblockcount++<30) $(this).droppable('option', 'disabled', true);
			});
		},
		out: function( event, ui ) {
			var cornerblockcount = 0;
			$( ".tile" ).each(function() {
				if (cornerblockcount++<30) $(this).droppable('option', 'disabled', false);
			});
		}
	});
	$("#entry").bind({
		keydown: function(e) {
			if (e.which==13) requestAction('applypattern');
			if (e.which==82||e.which==71||e.which==66||e.which==76||e.which==68||e.which==72||e.which==80||e.which==74||e.which==46||e.which==8||e.which==37||e.which==38||e.which==39||e.which==40||(e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67))) return true;
			return false;
		}
	});
	$("#colorfrom").bind({
		keydown: function(e) {
			if (e.which==13) requestAction('convert');
			if (e.which==82||e.which==71||e.which==66||e.which==76||e.which==68||e.which==72||e.which==80||e.which==74||e.which==46||e.which==8||e.which==37||e.which==38||e.which==39||e.which==40||(e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67))) return true;
			return false;
		}
	});
	$("#colorto").bind({
		keydown: function(e) {
			if (e.which==13) requestAction('convert');
			if (e.which==82||e.which==71||e.which==66||e.which==76||e.which==68||e.which==72||e.which==80||e.which==74||e.which==46||e.which==8||e.which==37||e.which==38||e.which==39||e.which==40||(e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67))) return true;
			return false;
		}
	});
	$("#multi").bind({
		keydown: function(e) {
			if ((e.which > 47 && e.which < 58) || e.which == 110 || e.which == 190 || e.which == 8 || e.which == 46 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.which >= 96 && e.which <= 105)) return true;
			return false;
		}
	});
	$(".mtypes").bind({
		keydown: function(e) {
			if (e.which==9||e.which==82||e.which==71||e.which==66||e.which==76||e.which==68||e.which==80||e.which==74||e.which==46||e.which==8||e.which==37||e.which==38||e.which==39||e.which==40) return true;
			return false;
		}
	});
	$(".mnums").bind({
		keydown: function(e) {
			if ((e.which > 47 && e.which < 58) || e.which == 8 || e.which==9||e.which == 46 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.which >= 96 && e.which <= 105)) return true;
			return false;
		}
	});
});

$(document).ready(function(){ // HOVER TEXT HACK
  $('input[type=text][title],input[type=password][title],textarea[title]').each(function(i){
    $(this).addClass('input-prompt-' + i);
    var promptSpan = $('<span class="input-prompt"/>');
    $(promptSpan).attr('id', 'input-prompt-' + i);
    $(promptSpan).append($(this).attr('title'));
    $(promptSpan).click(function(){
      $(this).hide();
      $('.' + $(this).attr('id')).focus();
    });
    if($(this).val() != ''){
      $(promptSpan).hide();
    }
    $(this).after(promptSpan);
    $(this).focus(function(){
      $('#input-prompt-' + i).hide();
    });
    $(this).blur(function(){
      if($(this).val() == ''){
        $('#input-prompt-' + i).show();
      }
    });
  });
});