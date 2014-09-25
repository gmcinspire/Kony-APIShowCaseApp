var displayImageHtmlAndroid = "<html><body style=\"margin: 0; padding: 0;\"><script>var imgWidthOnPortrait = window.screen.availWidth; if (imgWidthOnPortrait > window.screen.availHeight) { imgWidthOnPortrait = window.screen.availHeight; } document.write(\"<img src='\" + imgSrc + \"' width='\" + imgWidthOnPortrait + \"'>\"); </script></body></html>";
var displayImageHtmlIPhone = "<html><body style='background-image: url(imgSrc); background-size: cover; background-repeat: no-repeat;'></body></html>";

function showZoomImage(url, outputForm) {
	var displayImageHtml = kony.os.deviceInfo().name.toLocaleLowerCase() == "android"
		                       ? displayImageHtmlAndroid
		                       : displayImageHtmlIPhone;
	var html = displayImageHtml.replace("imgSrc", "\"" + url + "\"");
	outputForm.brwOutput.htmlString = html;
	outputForm.show();
}			

function isEmptyString(str) {
 	return str == null || str == "";
}

function showLoadingScreen(label) {
	if(kony.os.deviceInfo().name == "iPhone" || kony.os.deviceInfo().name == "iPad") {
		kony.application.showLoadingScreen("loadingscreen", label, constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, {shouldShowLabelInBottom: true,separatorHeight: 30});
	} else {
		kony.application.showLoadingScreen("loadingscreen", label, constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, null);
	}
}

function dismissLoadingScreen() {
	kony.application.dismissLoadingScreen();
}

function gmcInvokerAsync(inputParam, callBack, info) {
    var url = appConfig.url;    
    var sessionIdKey = "cacheid";
    inputParam.appID = appConfig.appId;
    inputParam.appver = appConfig.appVersion;
    inputParam["channel"] = "rc";
    inputParam["platform"] = kony.os.deviceInfo().name;
    inputParam[sessionIdKey] = sessionID;
    if (globalhttpheaders) {
        if (inputParam["httpheaders"]) {
            inputParam.httpheaders = mergeHeaders(inputParam.httpheaders, globalhttpheaders);
        } else {
            inputParam.httpheaders = globalhttpheaders;
        }
    }
    var connHandle = kony.net.invokeServiceAsync(url, inputParam, callBack, info);
    return connHandle;
}

function gmcAlertError(title, message) {
	var alertBasicConf = { 
		message: message, 
		alertType: constants.ALERT_TYPE_ERROR,
		alertTitle: title	
	};
	var alertPspConf = {};				
	var infoAlert = kony.ui.Alert(alertBasicConf, alertPspConf);
}

function gmcAlertInformation(title, message) {
	var alertBasicConf = { 
		message: message, 
		alertType: constants.ALERT_TYPE_INFO,
		alertTitle: title,
		yesLabel: "OK"
	};
	var alertPspConf = {};
	var infoAlert = kony.ui.Alert(alertBasicConf, alertPspConf);
}

function getSentenceWithDot(sentence) {
	return (sentence != null && sentence.length > 0 && sentence[sentence.length - 1] != '.') ?
		sentence + '.' :
		sentence;
}

function isEmptyResponse(response) {
	return !response || Object.getOwnPropertyNames(response).length === 0;
}