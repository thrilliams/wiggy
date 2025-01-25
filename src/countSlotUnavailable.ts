// this counts how many dots or similar are being diplayed in a given slots
export function countSlotUnavailable(slot: HTMLElement) {
	const cantCountElt = slot.querySelector(".cantCount")!;

	const dots = cantCountElt.querySelector("img");
	if (dots !== null) {
		const [_, count] = dots.src.match(/dot(\d)\.gif$/)!;
		return parseInt(count);
	}

	const count = cantCountElt.textContent!;
	return parseInt(count) || 0;
}
