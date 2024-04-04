// ==UserScript==
// @name         wiggy
// @namespace    https://aethre.co/
// @version      2024-04-04
// @description  makes whenisgood slightly more bearable
// @author       june
// @match        https://whenisgood.net/*/results/*
// @icon         http://whenisgood.net/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==

"use strict";

const paint = () => {
	unsafeWindow.paintCanDos();
	unsafeWindow.paintRespondents();

	for (const respondentKey in unsafeWindow.respondents) {
		const respondent = unsafeWindow.respondents[respondentKey];
		const respondentToggle = unsafeWindow.document
			.getElementById(respondent.id)
			.querySelector("input");
		if (respondentToggle !== null)
			respondentToggle.checked = respondent.included;
	}
};

/* adds a button to toggle each response */
const toggleAllButton = document.createElement("button");
toggleAllButton.innerText = "toggle all";
toggleAllButton.style.margin = "0 6px 6px 10px";

toggleAllButton.addEventListener("click", () => {
	for (const respondentKey in unsafeWindow.respondents) {
		const respondent = unsafeWindow.respondents[respondentKey];
		respondent.included = !respondent.included;
	}

	paint();
});

unsafeWindow.document
	.querySelector(
		"body > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > h4:nth-child(3)"
	)
	.after(toggleAllButton);

/* adds a toggle to each respondent to toggle them quickly */
for (const respondentKey in unsafeWindow.respondents) {
	const respondent = unsafeWindow.respondents[respondentKey];

	const respondentToggle = document.createElement("input");
	respondentToggle.type = "checkbox";
	respondentToggle.checked = respondent.included;

	respondentToggle.addEventListener("change", (event) => {
		respondent.included = respondentToggle.checked;
		paint();
	});

	// stops the response popup from triggering on toggle
	respondentToggle.addEventListener("click", (event) => {
		// event.stopImmediatePropagation();
		event.stopPropagation();
	});

	const respondentDiv = unsafeWindow.document.getElementById(respondent.id);
	respondentDiv.style.display = "flex";
	respondentDiv.style["justify-content"] = "space-between";
	respondentDiv.style["align-items"] = "center";
	respondentDiv.append(respondentToggle);
}
