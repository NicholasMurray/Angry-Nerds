
	var lessons=["<html></html>", // 1
	             "<head><title></title></head>", // 2
	             "<body><h1></h1><p></p></body>", // 3
	             "<form name='frm1' method='post' action='page1.py'></form>", // 4
	             "<input type='text' name='txtbox1' value='some text' />", // 5
	             "<input type='checkbox' checked='checked' />", // 6
                 "<img src='smiley.gif' alt='Smiley face' height='42' width='42' />", // 7
                 "<input type='submit' name='sbtn1' value='ok' />", // 8
	             "<link rel='stylesheet' href='style.css' type='text/css' />", // 9
                 "<script type='text/javascript' src='script.js'></script>"]; // 10
    var lessonDescriptions=["The HTML tag",
    						"Tags at the top of HTML page",
    						"Tags found in the body of a HTML page",
    						"A form tag",
    						"An text input box tag",
    						"A checkbox tag",
    						"An image tag",
    						"A submit button tag",
    						"A css link reference tag",
    						"A Javascript reference tag"];
	var NUMLESSONS=lessons.length;
	var NOLESSON=-1;
	var ilesson=NOLESSON,steptimeout,mistakes;
	var keyboard,entryfield,promptarea,promptletter,promptfollowup,lessonchoice;
	var keyhalo,spacebarhalo;
	var lastLesson,timeStart,msElapsed;
	var msGetReady=1000;	// delay before first character is shown
	var xkeyboard,ykeyboard;
	function absx(elem) {
		return elem.offsetLeft
		      +elem.offsetParent.offsetLeft
		      +elem.offsetParent.offsetParent.offsetLeft
		      +elem.offsetParent.offsetParent.offsetParent.offsetLeft;
	}
	function absy(elem) {
		return elem.offsetTop
		      +elem.offsetParent.offsetTop
		      +elem.offsetParent.offsetParent.offsetTop
		      +elem.offsetParent.offsetParent.offsetParent.offsetTop;
	}
	function loadBody() {
		keyboard=element('keyboard');
		entryfield=element('entryfield');
		promptarea=element('promptarea');
		promptletter=element('promptletter');
		promptfollowup=element('promptfollowup');
		lessonchoice=element('lessonchoice');
		keyhalo=element('keyhalo');
		spacebarhalo=element('spacebarhalo');
		xkeyboard=absx(keyboard);
		ykeyboard=absy(keyboard);
		retrieveLessonScoresAndStatus();
		ilesson=-1;
		prepareLesson(0);
	}
	var lastimg=null;
	function puthalo(img,x,y) {
		offhalo();
		img.style.left=(absx(keyboard)+x).toString()+'px';
		img.style.top=(absy(keyboard)+y).toString()+'px';
		img.style.display='';
		lastimg=img;
	}
	function offhalo() {
		if (lastimg != null) {
			lastimg.style.display='none';
		}
		lastimg=null;
	}
	var letterpos=[['qwerty',88,120],['uiop[]\\',313,120],["asdfg'",97,158],["hjkl;'",285,158],['zxcvb',116,194],['nm,./',300,194],['<>',379,194]],dx=38;
	function haloletter(chr) {
		for (var i=0 ; i < letterpos.length; i++) {
			var idx;
			if ((idx=letterpos[i][0].indexOf(chr)) >= 0) {
				puthalo(keyhalo,letterpos[i][1]+idx*dx,letterpos[i][2]);
				return true;
			}
		}
		return false;
	}
	function halospacebar() {
		puthalo(spacebarhalo,193,232);
	}
 
	function prepareLesson(lessonNumber) {
		if (lessonNumber != ilesson) {
			stopLesson(lessonNumber);
		}

		if (ilesson == NOLESSON) {
			if (0 <= lessonNumber) {
				if (ilesson != NOLESSON) {
					stopLesson(lessonNumber);
				}
				displayLessonDescription(lessonNumber);
				startLesson(lessonNumber);
			}
		}
		else {
			stopLesson(false);
		}
	}


	function displayLessonDescription(lessonNumber) {
		var el = document.getElementById('lessonDescription');
		el.textContent = 'Lesson ' + (lessonNumber+1) + ': ' + lessonDescriptions[lessonNumber];
	}

	function startLesson(_ilesson) {
		ilesson=_ilesson;
		ichar=0;
		feedback('','');
		promptarea.innerText='Please type the character ... ';
		entryfield.value='';
		mistakes=0;
		steptimeout=setTimeout(step0,msGetReady);
	}
	function step0() {
		timeStart=new Date();
		step1();
	}
	function step1() {
		var keywanted=lessons[ilesson].charAt(ichar);
		if (keywanted == ' ') {
			promptarea.innerText='Please hit the ';
			promptletter.innerText=' spacebar ';
			halospacebar();
		}
		else {
			promptarea.innerText='Please type the character ... ';
			promptletter.innerText=keywanted;
			haloletter(keywanted);
		}
		entryfield.focus();
	}
 
	String.prototype.lastc=function() {
		return this.substring(this.length-1);
	}
	function keychar(evt) {
		return String.fromCharCode(evt.keyCode ? evt.keyCode : evt.which);
	}
	var isKeydown=false;
	var isAutorepeat=false;
	var isShiftAllowed=true;
	function entryKeyDown(evt) {
		var blnIsSafeToDelete = true;
		if (evt.keyCode == 8) {
			blnIsSafeToDelete = isSafeToDelete();
			if (isSafeToDelete == true) {
				if (ilesson == NOLESSON) {
					return false;
				}
				if (keychar(evt) == '\x1B') {	// <Esc> key aborts the lesson
					stopLesson(false);
					return false;
				}
				var keyDownCode = evt.keyCode;
				if ((keyDownCode == 016) && (isShiftAllowed == false)) {
					if (isKeydown) {
						isAutorepeat=true;			// holding down the key
						promptfollowup.innerText="  Don't hold the key down.";
					}
					else {
						isKeydown=true;
					}	
				}
			} else {
				return false;	
			}
		}
		return !isAutorepeat;			// ignore auto-repeated key
	}

	function isSafeToDelete() {
		var el = document.getElementById('entryfield');
		var currentLessonArray = lessons[ilesson];
		var enteredCharLen = el.value.length;
		var requiredCharacters = ''
		var lessonCharacters = '';

		for (var i=0; i <= currentLessonArray.length; i++) {
			lessonCharacters = lessonCharacters + currentLessonArray[i]
		}
		requiredCharacters = lessonCharacters.substring(0, enteredCharLen);

		if (el.value == requiredCharacters) {
			return false;
		}
		return true;
	}

	function entryKeyUp(evt) {
		isKeydown=false;
		if (isAutorepeat) {
			isAutorepeat=false;
			promptfollowup.innerText="";
		}
		return true;
	}
	function lessonFocus(evt) {
		if (ilesson != NOLESSON) {
			return false;
		}
		return true;
	}
	function entryBlur(evt) {
		isKeydown=false;
		isAutorepeat=false;
		return true;
	}
	function feedback(text,clr) {
		promptfeedback.innerHTML=text;
		promptfeedback.style.color=clr;
	}
	function entryKeyPress(evt) {
		var currentLesson;
		if (ilesson == NOLESSON) {
			return false;
		}
		if (keychar(evt) == lessons[ilesson].charAt(ichar)) {
			ichar++;
			if (ichar < lessons[ilesson].length) {
				feedback('Right!&nbsp;','green');
				step1();
			}
			else {
					currentLesson = ilesson;
					stopLesson(true);
					var levelMessage = unlockLevelMessage(currentLesson, mistakes,score());

					feedback('Great!!  You finished. '
						+'Your score is ' + score()+'! '
						+'You made '+mistakes.toString()+' mistake'+(mistakes == 1 ? '' : 's')+'.'
						+ levelMessage,
						'blue');
					unlockLevel(currentLesson, mistakes);
					setHighScore(currentLesson,score());
					displayLevelStars(currentLesson,score());
			}
			return true;
		}
		else {
			feedback('Oops, not "'+keychar(evt)+'"!','red');
			mistakes++;
			step1();
			return false;
		}
	}
 

	function score() {
		var keysPerMinute,mistakesPerMinute;
		try {
			keysPerMinute=(lessons[lastLesson].length*60000)/msElapsed;
			mistakesPerMinute=(mistakes*60000)/msElapsed;
		}
		catch (e) {
			return 0;
		}
		return Math.round(keysPerMinute-5*mistakesPerMinute);
	}
	function stopLesson(good) {
		if (good) {
			var timeStop=new Date();
			msElapsed=timeStop.getTime()
			msElapsed = msElapsed-timeStart.getTime();
			lastLesson=ilesson;
		}
		else {
			entryfield.value='';
		}
		feedback('','');
		lessonDescription.innerHTML='&nbsp;';
		promptarea.innerText='';
		promptletter.innerText='';
		clearTimeout(steptimeout);
		offhalo();
		ilesson=NOLESSON;
	}
 
	function posn(elem) {
		return (elem.offsetLeft-element('keyboard').offsetLeft).toString()+','
		      +(elem.offsetTop-element('keyboard').offsetTop).toString();
	}
	function showpos() {
		element('lpos').innerText='';
		element('rpos').innerText='';
	}
	function doclick(img) {
		img.style.top=(img.offsetTop-10).toString() + 'px';
		img.style.left=(img.offsetLeft-10).toString() + 'px';
		showpos();
		return true;
	}


	function unlockLevelMessage(lessonNumber, mistakesCount,score) {
		var el1 = document.getElementById('level' + lessonNumber);
		var el2 = document.getElementById('level' + lessonNumber + 'LockIcon');
		var message = '';

		if (hasClass(el1, 'grey_button')) {
			message = '<br />You have unlocked level ' + (lessonNumber+1) + ' ' + (mistakes > 0 ? 'Silver Level!' : 'Gold!');
		}

		if ( (hasClass(el1, 'silver_button')) && (mistakesCount == 0)) {
			message = '<br />You have unlocked level ' + (lessonNumber+1) + ' ' + (mistakes > 0 ? 'Silver Level!' : 'Gold!');
		}

		if ( (hasClass(el1, 'silver_button')) && (mistakesCount > 0)) {
			message = '<br />Hard luck! Try again to unlock Gold Level!';
		}

		if (hasClass(el1, 'gold_button')) {
			message = '';
		}

		if ((score >= 50) & (score < 100)) {
			message = message + ' with one gold Star.';
		}
		if ((score >= 100) & (score < 150)) {
			message = message + ' with two gold Stars.';
		}
		if (score >= 150) {
			message = message + ' with three gold Stars.';
		}

		return message;
	}


	function unlockLevel(lessonNumber, mistakesCount) {
		var el1 = document.getElementById('level' + lessonNumber);
		var el2 = document.getElementById('level' + lessonNumber + 'LockIcon');

		// don't remove level if aleady achieved
		if (!(hasClass(el1, 'gold_button'))) {
			if (mistakes == 0) {
				removeClass(el1, 'grey_button');
				removeClass(el1, 'silver_button');
				addClass(el1, 'gold_button');			
			} else {
				removeClass(el1, 'grey_button');
				removeClass(el1, 'silver_button');
				addClass(el1, 'silver_button');			
			}
			removeClass(el2, 'ui-icon-locked');
			addClass(el2, 'ui-icon-unlocked');
		}
	}

	function setHighScore(lessonNumber,score) {
		var el = document.getElementById('levelscore' + lessonNumber);
		if (el.textContent < score) {
			el.textContent = score;
		}
	}

	function displayLevelStars(lessonNumber,score) {
		var e1 = document.getElementById('level' + lessonNumber + 'Star1');
		var e2 = document.getElementById('level' + lessonNumber + 'Star2');
		var e3 = document.getElementById('level' + lessonNumber + 'Star3');

		if (score >= 50) {
			if (!(hasClass(e1, 'gold_star'))) {
				removeClass(e1, 'silver_star');
				addClass(e1, 'gold_star');
			}
		}
		if (score >= 100) {
			if (!(hasClass(e2, 'gold_star'))) {
				removeClass(e2, 'silver_star');
				addClass(e2, 'gold_star');
			}
		}
		if (score >= 150) {
			if (!(hasClass(e3, 'gold_star'))) {
				removeClass(e3, 'silver_star');
				addClass(e3, 'gold_star');
			}
		}
	}

	function removeLevelStars(lessonNumber) {
		var e1 = document.getElementById('level' + lessonNumber + 'Star1');
		var e2 = document.getElementById('level' + lessonNumber + 'Star2');
		var e3 = document.getElementById('level' + lessonNumber + 'Star3');

		if (hasClass(e1, 'gold_star')) {
			removeClass(e1, 'gold_star');
			addClass(e1, 'silver_star');
		}
		if (hasClass(e2, 'gold_star')) {
			removeClass(e2, 'gold_star');
			addClass(e2, 'silver_star');
		}
		if (hasClass(e3, 'gold_star')) {
			removeClass(e3, 'gold_star');
			addClass(e3, 'silver_star');
		}
	}

	function saveLessonScoresAndStatus() {
		var el1;
		var el2;
		var el3;
		var user_id ='current_user';
		var user_lesson_scores = [];
		var current_lesson_score;
		var current_lesson_status;
		var lesson_details;

		for (var i = 0; i < lessons.length; i++) {

			el1 = document.getElementById('level' + i);
			el2 = document.getElementById('level' + i + 'LockIcon');
			el3 = document.getElementById('levelscore' + i);

			current_lesson_score = el3.innerHTML;

			if (hasClass(el1, 'grey_button')){
				current_lesson_status = 'grey_button';
			} else if (hasClass(el1, 'silver_button')) {
				current_lesson_status = 'silver_button';
			} else if (hasClass(el1, 'gold_button')) {
				current_lesson_status = 'gold_button';
			}

			lesson_details = { 'lesson' : i, 'score' : current_lesson_score, 'lesson_status' : current_lesson_status };

			user_lesson_scores.push(lesson_details);
		}

		localStorage.clear(); 
		localStorage.setItem(user_id,JSON.stringify(user_lesson_scores));
	}


	function retrieveLessonScoresAndStatus() {
		var user_id ='current_user';
		var el1;
		var el2;
		var el3;
		var current_lesson_details;

		if (localStorage.getItem(user_id)) {
			var user_lesson_scores = JSON.parse(localStorage.getItem(user_id));
		}

		for (var i = 0; i < user_lesson_scores.length; i++) {
			current_lesson_details = user_lesson_scores[i];
			el1 = document.getElementById('level' + i);
			el2 = document.getElementById('level' + i + 'LockIcon');
			el3 = document.getElementById('levelscore' + i);
			el3.innerHTML = current_lesson_details.score;
			removeClass(el1, 'grey_button');
			addClass(el1, current_lesson_details.lesson_status);
			displayLevelStars(i,current_lesson_details.score);
			setLockIcon(i);
		}
	}

	function setLockIcon(lessonNumber) {
		var el1 = document.getElementById('level' + lessonNumber);
		var el2 = document.getElementById('level' + lessonNumber + 'LockIcon');

		if (hasClass(el1, 'gold_button')) {
			removeClass(el2, 'ui-icon-locked');
			addClass(el2, 'ui-icon-unlocked');
		}
	}



	function resetLessonScoresAndLevels() {
		var el1;
		var el2;
		var el3;

		for (var i = 0; i < lessons.length; i++) {
			el1 = document.getElementById('level' + i);
			el2 = document.getElementById('level' + i + 'LockIcon');
			el3 = document.getElementById('levelscore' + i);
			removeClass(el1, 'gold_button');
			removeClass(el1, 'silver_button');
			addClass(el1, 'grey_button');
			if (hasClass(el2, 'ui-icon-unlocked')) {
				removeClass(el2, 'ui-icon-unlocked');
				addClass(el2, 'ui-icon-locked');
			}
			el3.innerHTML = '';
			removeLevelStars(i);
		}


		var lessonDescription = document.getElementById('lessonDescription');
		var promptfeedback = document.getElementById('promptfeedback');
		var promptarea = document.getElementById('promptarea');
		var promptletter = document.getElementById('promptletter');
		var promptfollowup = document.getElementById('promptfollowup');
		var promptall = document.getElementById('promptall');
		var entryfield = document.getElementById('entryfield');


		lessonDescription.innerHTML = '&nbsp;';
		promptfeedback.innerHTML = '';
		promptarea.innerHTML = '';
		promptletter.innerHTML = '';
		promptfollowup.innerHTML = '';
		promptall.innerHTML = '';
		entryfield.value = '';

		localStorage.clear();
	}


	function hasClass(ele,cls) {
	  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	}

	function addClass(ele,cls) {
	  if (!hasClass(ele,cls)) ele.className += " "+cls;
	}

	function removeClass(ele,cls) {
	  if (hasClass(ele,cls)) {
	      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
	      ele.className=ele.className.replace(reg,' ');
	  }
	}

