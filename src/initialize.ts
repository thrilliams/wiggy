export function initialize() {
	// this removes the default WiG systems
	const oldContainer = document.querySelector(".respondents")!;
	for (const node of document.querySelectorAll(
		".respondents > :not(.respondentPopup)"
	))
		node.remove();

	const appContainer = document.createElement("div");
	appContainer.style.marginLeft = "10px";
	oldContainer.after(appContainer);

	// this tweaks table formatting slightly to make it consistent and avoid layout shifting
	for (const element of document.querySelectorAll(
		".slot"
	) as NodeListOf<HTMLElement>)
		element.style.minWidth = "90px";

	// hack to make name highlighting (specifically, de-highlighting) work again
	const outTdOriginal = unsafeWindow.outTd;
	unsafeWindow.outTd = () => {
		outTdOriginal();
		for (const key of Object.keys(unsafeWindow.respondents)) {
			(document.getElementById(key.slice(1)) as HTMLElement).className =
				"";
		}
	};

	unsafeWindow.paintRespondents = () => {};

	return appContainer;
}
