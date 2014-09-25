function initFrmProofMultipage() {
	frmProofMultipage.defaultAnimationEnabled = false;
}

function showImageMultipage() {
	getQueryPropertiesOutput(MULTIPAGE_WFD, asyncCallbackQueryProperties);
}

function getQueryPropertiesOutput(wfd, asyncCallback) {
	var serviceSetting = {
		serviceID: "QueryProperties",
		corrId: wfd
	};
	var info = {};
	showLoadingScreen("Loading...");
	gmcInvokerAsync(serviceSetting, asyncCallback, info);
}

function asyncCallbackQueryProperties(status, response, info) {
	if (status == 400) {
		if (isResponseCorrect(response)) {
			var totalSheetCount = response.properties[0].totalSheetCount;
			initPager(totalSheetCount);	
			getRunJobOutput("Image", MULTIPAGE_WFD, 1, asyncCallbackShowImageMultipage);
			return;
		}
	}
	if (isEmptyResponse(response) == false){
		dismissLoadingScreen();
	}
}

function getRunJobOutput(engine, wfd, pageNumber, asyncCallback) {
	var serviceSetting = {
		serviceID: "RunJobMultipage",
		corrId: wfd,
		engine: engine,
		pageNumber: pageNumber
	};
	var info = {};
	info["pageNumber"] = pageNumber;
	showLoadingScreen("Loading...");
	gmcInvokerAsync(serviceSetting, asyncCallback, info);
	}

function asyncCallbackShowImageMultipage(status, response, info) {
	if (status == 400) {
		var url = getDocumentUrl(response);
		if (url != null) {
			var page = info["pageNumber"];
			if (page != displayedPage) {
				showZoomImage(url, frmProofMultipageOutput);
				displayedPage = page;
				refreshPager();
			}
		}
	}
	if (isEmptyResponse(response) == false){
		dismissLoadingScreen();
	}
}