import { paintUnavailable } from "./paintUnavailable";

// this function wraps the normal whenisgood paint function so we can do our own thing
export function paint() {
	unsafeWindow.paintCanDos();
	paintUnavailable();
}
