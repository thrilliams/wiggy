import { respondents } from "./respondents";

interface RespondentProps {
	id: string;
	included: boolean;
	setIncluded: (value: boolean) => void;
}

export function Respondent({ id, included, setIncluded }: RespondentProps) {
	const respondent = respondents.get(id);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<span
				id={id}
				style={{ cursor: "pointer" }}
				onClick={() => {
					const dummyDiv = document.createElement("div");
					dummyDiv.id = id;
					unsafeWindow.clickRespondent(dummyDiv);
				}}
			>
				{respondent?.name}
			</span>
			<input
				type="checkbox"
				checked={included}
				onChange={(event) => setIncluded(event.currentTarget.checked)}
			/>
		</div>
	);
}
