import { useState } from "preact/hooks";
import { paint } from "./paint";
import { Respondent } from "./Respondent";
import { fuse, respondentIds, respondents } from "./respondents";

export function App() {
	const [includedIds, setIncludedIdsRaw] = useState(respondentIds);

	const setIncludedIds = (newIds: string[]) => {
		for (const [id, respondent] of respondents.entries())
			respondent.included = newIds.includes(id);
		setIncludedIdsRaw(newIds);
		paint();
	};

	const setIncluded = (id: string, value: boolean) => {
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

	const toggleAll = () => {
		if (includedIds.length > respondentIds.length / 2) {
			setIncludedIds([]);
		} else {
			setIncludedIds([...respondentIds]);
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
			<button onClick={toggleAll}>toggle all</button>
			<select
				onChange={(event) => setSortMode(event.currentTarget.value)}
			>
				<option
					value="name"
					selected={sortMode === "name"}
				>
					sort by name
				</option>
				<option
					value="date"
					selected={sortMode === "date"}
				>
					sort by date
				</option>
				<option
					value="fuse"
					selected={sortMode === "fuse"}
				>
					sort by relevance
				</option>
			</select>
			<input
				type="text"
				placeholder="search..."
				value={searchQuery}
				onInput={(event) => setSearchQuery(event.currentTarget.value)}
			/>
			<hr style={{ width: "100%", margin: "0" }} />
			{shownRespondents.map(({ id }) => (
				<Respondent
					id={id}
					key={id}
					included={includedIds.includes(id)}
					setIncluded={(value) => setIncluded(id, value)}
				/>
			))}
		</div>
	);
}
