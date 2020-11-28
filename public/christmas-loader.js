const SCRIPT_NAME = 'christmas-loader.js';

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

const getShopId = () => getParams(SCRIPT_NAME).shop;

httpGetAsync("https://07099abfc99a.ngrok.io/public-config?shop=" + getShopId(), function (receivedConfig) {
      receivedConfig = JSON.parse(receivedConfig);
      console.log('received config');

      //TODO Apply Config
});

//TODO Init Game