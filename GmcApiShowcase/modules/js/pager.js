function initPager(totalSheetCount) {
	displayedPage = 0;
	pageCount = totalSheetCount;
	refreshPager();
}

function prevPage() {
	getRunJobOutput("Image", MULTIPAGE_WFD, displayedPage - 1, asyncCallbackShowImageMultipage);
}

function nextPage() {
	getRunJobOutput("Image", MULTIPAGE_WFD, displayedPage + 1, asyncCallbackShowImageMultipage);
}

function refreshPager() {
	hbxFooter.lblPageNumber.text = displayedPage + " of " + pageCount;
	hbxFooter.hbxPrev.isVisible = displayedPage > 1;
	hbxFooter.hbxNext.isVisible = displayedPage < pageCount;
}