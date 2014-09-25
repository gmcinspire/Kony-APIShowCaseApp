function initFrmList() {
	frmList.defaultAnimationEnabled = false;
}

function showDocumentList(directory) {
	var inputParam = {
		serviceID: "List",
		path: LIST_SAMPLE_DIRECTORY + directory
	};
	var info = {};
	showLoadingScreen("Loading...");
	gmcInvokerAsync(inputParam, asyncCallbackList, info);
}

function asyncCallbackList(status, response) {
	if (status == 400) {
		if (response["opstatus"] == 0) {
			var success = fillItemsControl(response["documents"]);
			if (success) {
				frmListOutput.show();
			}
		} else {
			gmcAlertError("Error", "Connection to service failed.");
		}
	}
	if (isEmptyResponse(response) == false) {
		dismissLoadingScreen();
	}
}

function fillItemsControl(documents) {
	frmListOutput.segDocuments.removeAll();
	if (documents == null || documents.length == 0) {
		gmcAlertInformation("", "Directory does not exist or is empty.");
		return false;
	}

	frmListOutput.segDocuments.widgetDataMap = {
	    lblTitle: "lblTitle",
	    lblNumber: "lblNumber",
	    lblDescription: "lblDescription"
	}

	var segmentData = getDocumentListSegmentData(documents);
	frmListOutput.segDocuments.setData(segmentData);
	return true;
}

function getDocumentListSegmentData(documents) {
	var segmentData = [];
	for (var i = 0; i < documents.length; i++) {
		var document = documents[i];
		var title = document["title"];
		if (isEmptyString(title)) {
			title = document["corrId"];
		}

		segmentData.push({
			lblTitle: title,
			lblNumber: document["number"],
			lblDescription: document["description"],
			template: hbxSegment
		});
	}
	return segmentData;
}