import { countSlotUnavailable } from "./countSlotUnavailable";

// this makes each cell color-coded to the number of people who can't make that time
export function paintUnavailable() {
	const slots = [...document.querySelectorAll(".slot")] as HTMLElement[];

	const cantCounts = slots.map((slot) => countSlotUnavailable(slot));
	const maxCant = Math.max(...cantCounts);

	for (let i in slots) {
		const slot = slots[i];
		const proportion = cantCounts[i] / maxCant || 0;

		const cantCountStyle = (slot.querySelector(".cantCount") as HTMLElement)
			.style;
		if (cantCountStyle !== undefined) cantCountStyle.display = "none";

		if (proportion === 0) {
			slot.style.backgroundColor = "#dddd00";
		} else {
			slot.style.backgroundColor = `color-mix(in srgb, #ff0000 ${Math.floor(
				proportion * 100
			)}%, #00ff00)`;
		}
	}
}
