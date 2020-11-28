let SCRIPT_NAME = 'christmas-loader.js';
let HOST = 'https://07099abfc99a.ngrok.io';

function getParams(scriptName) {
	var scripts = document.getElementsByTagName("script");

	for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf("/" + scriptName) > -1) {
      var pa = scripts[i].src.split("?").pop().split("&");

      // Split each key=value into array, the construct js object
      var p = {};
      for (var j = 0; j < pa.length; j++) {
        var kv = pa[j].split("=");
        p[kv[0]] = kv[1];
      }
      return p;
    }
	}
	return {};
}

let getShopId = () => getParams(SCRIPT_NAME).shop;

let reward = {  body: "", code: "" };
let applyReward = () => {
  document.getElementById("reward-text").innerHTML = `${reward.body} ${reward.code}`
}

function httpGetAsync(theUrl, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
					callback(xmlHttp.responseText);
			} else if (xmlHttp.readyState == 4) {
					// httpGetAsync(theUrl, callback);
			}
	}
	xmlHttp.open("GET", theUrl, true);
	xmlHttp.send(null);
}

httpGetAsync(`${HOST}/public-config?shop=${getShopId()}`, function (receivedConfig) {
      receivedConfig = JSON.parse(receivedConfig);
      reward = receivedConfig.reward;
      console.log('received config');
      console.log(receivedConfig);
      applyReward();      
});

/*** CODE BASE FOR GAME MOSTLY FROM HERE https://codepen.io/ricardpriet/pen/NXNLax ***/
let loadGameLogic = () => {
  ( function( $ ) {
    /* initial modal */
    $( '.modal-a' ).on('click', '#star-game', function() {
      $( '.modal-a' ).fadeOut( 1500 );
      $( 'body' ).removeClass( 'silo-modal-open initial-modal' );
      var currentHeading = $( '#clues .active' );
      currentHeading.hide();
      currentHeading.attr( 'class', 'clue hidden absolute' );
      currentHeading.next( '.clue' ).fadeIn( 1500 );
      currentHeading.next( '.clue' ).attr( 'class', 'clue hidden active' );
      $( '#character-head' ).attr( 'class', 'bounce' );
      window.setTimeout( function(){
        $( '#character-head' ).attr( 'class', '' );
      }, 4000);
    } );
    /* true items */
    $( '#out-tree' ).on('click', '.active', function() {
      $( this ).attr( 'class', 'item' );
      $( this ).fadeOut( 1500 );
      $( this ).next( '.noitem' ).attr( 'class', 'item active' );
      var currentHeading = $( '#clues .active' );
      currentHeading.hide();
      currentHeading.attr( 'class', 'clue hidden absolute' );
      currentHeading.next( '.clue' ).fadeIn( 1500 );
      currentHeading.next( '.clue' ).attr( 'class', 'clue hidden active' );
      $( '#character-head' ).attr( 'class', 'bounce' );
      window.setTimeout( function(){
        $( '#character-head' ).attr( 'class', '' );
      }, 3000);
      var currentItem = $( '#on-tree .active' );
      currentItem.fadeIn( 1500 );
      currentItem.attr( 'class', 'visible' );
      currentItem.next( '.item' ).attr( 'class', 'item hidden active' );
    } );
    /* wrong items */
    $( '#mini-city' ).on('click', '.noitem', function() {
      var shakeItem = $( this );
      $( this ).attr( 'class', 'noitem shake' );
      window.setTimeout( function(){
        shakeItem.attr( 'class', 'noitem' );
      }, 1000);
    } );
    /* final modal */
    $( '#out-tree' ).on('click', '#star-01.active', function() {
      window.setTimeout( function(){
        $( '.modal-b' ).fadeIn( 1500 );
        $( 'body' ).addClass( 'silo-modal-open final-modal' );
      }, 1500);
    } );
  } )( jQuery );
}

function initCss() {
  var fileref = document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", `${HOST}/game.css`);
  document.head.appendChild(fileref);
}

initCss();

let templateLoaded = () => {
  applyReward();
  loadGameLogic();
}

/*** CODE BASE FOR GAME MOSTLY FROM HERE https://codepen.io/ricardpriet/pen/NXNLax ***/
( function( $ ) {
  $('#christmas-game').load(`${HOST}/game-template.html`, undefined, templateLoaded);
} )( jQuery );