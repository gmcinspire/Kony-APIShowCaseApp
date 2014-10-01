var DOCUMENT_ID = "1";
var SIGNER_ID = "1";
var EMAIL = "fakemail@froodeco.com";
var SILANIS_URL = "https://sandbox.e-signlive.com";

function frmSigningOnInit() {
	frmSigning.defaultAnimationEnabled = false;
}

function frmSigningPreshow() {
	var jumpedOut = loadValueFromStore(KEY_JUMPED_OUT);
	if (jumpedOut){
		frmSigning.txtName.text = loadValueFromStore(KEY_CLIENT_NAME);
		frmSigning.txtSurname.text = loadValueFromStore(KEY_CLIENT_SURNAME);
	}
	saveValueToStore(KEY_JUMPED_OUT,false);
}

function frmSigningOnHide() {
	saveValueToStore(KEY_JUMPED_OUT, false);
}

function getSingingPageUrl() {
	invokeCreateSign(asyncCallbackCreateSign);
}

function getSigningStatus() {
	invokeGetPackageStatus(asyncCallbackGetPackageStatus);
}

function invokeCreateSign(asyncCallback) {
	var serviceDefinition = generateServiceDefinition();
	var refData = {};
	showLoadingScreen("Loading...");
	gmcInvokerAsync(serviceDefinition, asyncCallback, refData);
}

function invokeGetPackageStatus(asyncCallback) {
	var packageId = loadValueFromStore(KEY_PACKAGE_ID);
	if (!packageId) {
		var title = "Document Status";
		var message = "You don't have any signed document yet.";
		gmcAlertInformation(title, message);
		return;
	}
	var serviceDefinition = { 
			serviceID: "GetPackageStatus",
			packageId: packageId,
			documentId: DOCUMENT_ID
	};
	var refData = {};
	showLoadingScreen("Loading...");
	gmcInvokerAsync(serviceDefinition, asyncCallback, refData);
}

function generateServiceDefinition() {
	var clientName = frmSigning.txtName.text,
		clientSurname = frmSigning.txtSurname.text;

	saveValueToStore(KEY_CLIENT_NAME, clientName);
	saveValueToStore(KEY_CLIENT_SURNAME, clientSurname);

	var serviceDefinition = { 
		serviceID: "CreateSign",
		corrId: SIGNING_DOCUMENT_WFD,
		clientName: clientName,
		clientSurname: clientSurname,
		packageName: "PackageFromShowCaseAPI",
		packageDescription: "Package from GMC - Kony API Showcase.",
		documentName: "SampleDocument",
		documentId: DOCUMENT_ID
	};
	addSignerCollection(serviceDefinition, clientName, clientSurname);
	addSignatureCollection(serviceDefinition);
	
	return serviceDefinition;
}

function addSignerCollection (serviceDefinition, name, surname) {
	var signers = [];
	var signer = {};
	signer.signerId = SIGNER_ID;
	signer.signerName = name;
	signer.signerSurname = surname;
	signer.signerEmail = EMAIL;
	signers.push(signer);
	
	serviceDefinition.signer = JSON.stringify(signers);
}

function addSignatureCollection (serviceDefinition) {
	var signatures = [];
	var signature = {};
	signature.signerId = SIGNER_ID;
	signature.signatureXPosition = "500";
	signature.signatureYPosition = "850";
	signature.signatureOnPage = "0";
	signature.signatureHeight = "110";
	signature.signatureWidth = "200";
	signatures.push(signature);
	
	serviceDefinition.signature = JSON.stringify(signatures);
}

function asyncCallbackCreateSign(status, response, info) {
	if (isEmptyResponse(response) == false){
		dismissLoadingScreen();
	}
	if (status == 400) {
		if (isResponseCorrect(response)) {
			var packageId = response.packageId;
			var signerToken = 
				(response.signers[0].signerId == SIGNER_ID)
				? response.signers[0].token
				: response.signers[1].token;
			
			saveValueToStore(KEY_PACKAGE_ID, packageId);
			showSigningPage(signerToken);
		}
	}
}

function asyncCallbackGetPackageStatus(status, response, info) {
	if (isEmptyResponse(response) == false) {
		dismissLoadingScreen();
	}
	if (status == 400) {
		if (isResponseCorrect(response)) {
			var document = 
				(response.documents[0].id == DOCUMENT_ID)
				? response.documents[0]
				: response.documents[1];
			
			var title = "Document Status";
			var message;
			if (document.status == "SIGNING_PENDING") {
				message = "This document is not yet signed.";
			} else if (document.status == "DOCUMENT_COMPLETE") {
				message = "This document is signed.";
			} else {
				message = "This document is waiting for authentication.";
			}
			gmcAlertInformation(title, message);
		}
	}
}

function showSigningPage(signersToken) {
	var url = decodeURIComponent(SILANIS_URL + "/access?sessionToken=" + signersToken);
	saveValueToStore(KEY_JUMPED_OUT, true);
	kony.application.openURL(url);
}