function initFrmProof() {
	frmProof.defaultAnimationEnabled = false;
}

function showHtml() {
	showRunJobOutput("HTML", SIMPLE_WFD, asyncCallbackShowHtml);
}

function showPdf() {
	showRunJobOutput("PDF", SIMPLE_WFD, asyncCallbackDownloadPdf);
}

function showRaster() {
	showRunJobOutput("Raster", SIMPLE_WFD, asyncCallbackShowHtml);
}

function showImage() {
	showRunJobOutput("Image", SIMPLE_WFD, asyncCallbackShowHtml);
}

function showDynamicDocument() {
	showRunJobOutput("Dynamic Documents", DYNAMIC_WFD, asyncCallbackShowHtml);
}

function showRunJobOutput(engine, wfd, asyncCallback) {
	var name = frmProof.txtName.text;
	var surname = frmProof.txtSurname.text;
	var serviceSetting = {
		serviceID: "RunJob",
		corrId: wfd,
		name: name,
		surname: surname,
		engine: engine
	};

	setImageFormat(serviceSetting);

	var info = {};
	showLoadingScreen("Loading...");
	gmcInvokerAsync(serviceSetting, asyncCallback, info);
}

function setImageFormat(serviceSetting) {
	if (serviceSetting.engine == "Image") {
		serviceSetting.parameter = "-imageformat";
		serviceSetting.parameterValue = "jpg"; 
	} else {
		serviceSetting.parameter = "";
		serviceSetting.parameterValue = "";
	}
}

function asyncCallbackShowHtml(status, response, info) {
	if (status == 400) {
		var url = getDocumentUrl(response);
		if (url != null) {
			frmProofOutput.brwOutput.requestURLConfig = {
				URL: url,
				requestMethod: constants.BROWSER_REQUEST_METHOD_GET
			};
			frmProofOutput.show();
		}
	}
	if (isEmptyResponse(response) == false) {
		dismissLoadingScreen();
	}
}

function asyncCallbackDownloadPdf(status, response, info) {
	if (status == 400) {
		var url = getDocumentUrl(response);
		if (url != null) {
			kony.application.openURL(url);
		}
	}
	if (isEmptyResponse(response) == false) {
		dismissLoadingScreen();
	}
}

function getDocumentUrl(response) {
	if (isResponseCorrect(response)) {
		var documentUrl =  response["url"];
		return decodeURIComponent(documentUrl);
	}
	return null;
}

function isResponseCorrect(response) {
	var correct = response["opstatus"] == 0;
	if (correct) {
		var errorCollection = response["errors"];
		if (errorCollection != null) {
			var errorMessages = "";
			for (var i = 0; i < errorCollection.length; i++) {
				errorMessages += "Error code: " + errorCollection[i]["errorCode"] + ".\r\n\r\n";
				errorMessages += "Error message: " + getSentenceWithDot(errorCollection[i]["errorMessage"]) + "\r\n\r\n";
			}
			correct = false;
			gmcAlertError("Error while making proof", errorMessages);
		}
	} else {
		gmcAlertError("Error", "Connection to service failed.");
	}
	return correct;
}