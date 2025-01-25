import Fuse from "fuse.js";

export const respondents = new Map(
	Object.keys(unsafeWindow.respondents).map((id) => [
		id.slice(1),
		unsafeWindow.respondents[id],
	])
);

export const respondentIds = [...respondents.keys()];

export const fuse = new Fuse(
	Object.keys(unsafeWindow.respondents).map(
		(id) => unsafeWindow.respondents[id]
	),
	{
		keys: ["name"],
		threshold: 0.2,
		includeScore: true,
	}
);
