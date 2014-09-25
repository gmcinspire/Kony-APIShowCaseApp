var KEY_JUMPED_OUT = "jumpedOut";
var KEY_PACKAGE_ID = "signingPackageId";
var KEY_CLIENT_NAME = "clientName";
var KEY_CLIENT_SURNAME = "clientSurname";

function saveValueToStore(key, value) {
	kony.store.setItem(key, value);
}

function loadValueFromStore(key){
	return kony.store.getItem(key);
}