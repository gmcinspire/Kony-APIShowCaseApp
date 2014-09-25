function changeMenuView() {
	setMenu(!showedMenu);
}

function hideMenu() {
	setMenu(false);
}

function setMenuAfterRotation() {
	setMenu(showedMenu);
}

function setMenu(showMenu) {
	setMenuInForm(frmStart, showMenu);
	setMenuInForm(frmProof, showMenu);
	setMenuInForm(frmProofMultipage, showMenu);
	setMenuInForm(frmList, showMenu);
	setMenuInForm(frmSigning, showMenu);
	showedMenu = showMenu;
}

function setMenuInForm(frm, showMenu) {
	if (showMenu) {
		frm.sbxGlobal.scrollToBeginning();
	} else {
		frm.sbxGlobal.scrollToEnd();
	}
}