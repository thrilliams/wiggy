// ==UserScript==
// @name         wiggy
// @namespace    https://aethre.co/
// @version      2024-05-10
// @downloadURL  https://github.com/thrilliams/wiggy/raw/main/wiggy.user.js
// @updateURL    https://github.com/thrilliams/wiggy/raw/main/wiggy.user.js
// @supportURL   https://github.com/thrilliams/wiggy/issues
// @description  makes whenisgood slightly more bearable
// @author       june
// @match        https://whenisgood.net/*/results/*
// @match        http://whenisgood.net/*/results/*
// @icon         http://whenisgood.net/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==

/* boilerplate */
"use strict";

// this counts how many dots or similar are being diplayed in a given slots
function countSlotUnavailable(slot) {
	const cantCountElt = slot.querySelector(".cantCount");

	const dots = cantCountElt.querySelector("img");
	if (dots !== null) {
		const [_, count] = dots.src.match(/dot(\d)\.gif$/);
		return parseInt(count);
	}

	const count = cantCountElt.innerText;
	return parseInt(count) || 0;
}

// this makes each cell color-coded to the number of people who can't make that time
function paintUnavailable() {
	const slots = [...document.querySelectorAll(".slot")];

	const cantCounts = slots.map((slot) => countSlotUnavailable(slot));
	const maxCant = Math.max(...cantCounts);

	for (let i in slots) {
		const slot = slots[i];
		const proportion = cantCounts[i] / maxCant || 0;

		const cantCountStyle = slot.querySelector(".cantCount")?.style;
		if (cantCountStyle !== undefined) cantCountStyle.display = "none";

		slot.style.backgroundColor = `color-mix(in srgb, #ff0000 ${Math.floor(
			proportion * 100
		)}%, #00ff00)`;
	}
}

// this function wraps the normal whenisgood paint function so we can do our own thing
function paint() {
	unsafeWindow.paintCanDos();
	paintUnavailable();
}

// this removes the default WiG systems
const oldContainer = document.querySelector(".respondents");
for (const node of document.querySelectorAll(
	".respondents > :not(.respondentPopup)"
))
	node.remove();

const appContainer = document.createElement("div");
appContainer.style.marginLeft = "10px";
oldContainer.after(appContainer);

// sometimes imports take a sec
appContainer.innerText = "loading...";

// this tweaks table formatting slightly to make it consistent and avoid layout shifting
for (const element of document.querySelectorAll(".slot"))
	element.style.minWidth = "90px";

// hack to make name highlighting (specifically, de-highlighting) work again
const outTdOriginal = unsafeWindow.outTd;
unsafeWindow.outTd = () => {
	outTdOriginal();
	for (const key of Object.keys(unsafeWindow.respondents))
		document.getElementById(key.slice(1)).className = "";
};

unsafeWindow.paintRespondents = () => {};

// imports from esm.sh, using dynamic import syntax
const { render, h, Fragment } = await import(
	"https://esm.sh/preact@10.20.1?exports=render,h,Fragment"
);
const { useState } = await import(
	"https://esm.sh/preact@10.20.1/hooks?exports=useState"
);
const { default: htm } = await import(
	"https://esm.sh/htm@3.1.1?exports=default"
);

const { default: Fuse } = await import(
	"https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.mjs"
);

// helper to use jsx-adjacent syntax without bundling
const html = htm.bind(h);

/* the app */
const respondents = new Map(
	Object.keys(unsafeWindow.respondents).map((id) => [
		id.slice(1),
		unsafeWindow.respondents[id],
	])
);

const respondentIds = [...respondents.keys()];

const fuse = new Fuse(
	Object.keys(unsafeWindow.respondents).map(
		(id) => unsafeWindow.respondents[id]
	),
	{
		keys: ["name"],
		threshold: 0.2,
		includeScore: true,
	}
);

function Respondent({ id, included, setIncluded }) {
	const respondent = respondents.get(id);

	return html`<div
		style=${{
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
		}}
	>
		<span
			id=${id}
			style=${{ cursor: "pointer" }}
			onClick=${() => {
				const dummyDiv = document.createElement("div");
				dummyDiv.id = id;
				unsafeWindow.clickRespondent(dummyDiv);
			}}
			>${respondent?.name}</span
		>
		<input
			type="checkbox"
			checked=${included}
			onChange=${(event) => setIncluded(event.target.checked)}
		/>
	</div>`;
}

function App() {
	const [includedIds, setIncludedIdsRaw] = useState(respondentIds);

	const setIncludedIds = (newIds) => {
		for (const [id, respondent] of respondents.entries())
			respondent.included = newIds.includes(id);
		setIncludedIdsRaw(newIds);
		paint();
	};

	const setIncluded = (id, value) => {
		if (value) {
			setIncludedIds([...includedIds, id]);
		} else {
			setIncludedIds(
				includedIds.filter((includedId) => includedId !== id)
			);
		}
	};

	const [searchQuery, setSearchQuery] = useState("");
	const [sortMode, setSortMode] = useState("fuse");

	const shownRespondents =
		searchQuery.length > 0
			? fuse.search(searchQuery).map((result) => result.item)
			: [...respondents.values()];
	if (sortMode === "name")
		shownRespondents.sort((a, b) => a.name.localeCompare(b.name));
	if (sortMode === "date")
		shownRespondents.sort(
			(a, b) =>
				new Date(a.updated).getTime() - new Date(b.updated).getTime()
		);

	return html`<div
		style=${{ display: "flex", flexDirection: "column", gap: "5px" }}
	>
		<button
			onClick=${() =>
				setIncludedIds(
					respondentIds.filter((id) => !includedIds.includes(id))
				)}
		>
			toggle all
		</button>
		<select onChange=${(event) => setSortMode(event.target.value)}>
			<option value="name" selected=${sortMode === "name"}>
				sort by name
			</option>
			<option value="date" selected=${sortMode === "date"}>
				sort by date
			</option>
			<option value="fuse" selected=${sortMode === "fuse"}>
				sort by relevance
			</option>
		</select>
		<input
			type="text"
			placeholder="search..."
			value=${searchQuery}
			onInput=${(event) => setSearchQuery(event.target.value)}
		/>
		<hr style=${{ width: "100%", margin: "0" }} />
		${shownRespondents.map(
			({ id }) =>
				html`<${Respondent}
					id=${id}
					key=${id}
					included=${includedIds.includes(id)}
					setIncluded=${(value) => setIncluded(id, value)}
				/>`
		)}
	</div>`;
}

/* rendering */

appContainer.innerText = "";
render(html`<${App} />`, appContainer);
paintUnavailable();
