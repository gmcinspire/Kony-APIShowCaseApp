function initFrmStart() {
	frmStart.defaultAnimationEnabled = false;
}

function frmStartPostshow() {
	var jumpedOut = loadValueFromStore(KEY_JUMPED_OUT);
	if (jumpedOut) {
		frmSigning.show();
	}
}