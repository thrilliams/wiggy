import { render } from "preact";
import { App } from "./App";
import { initialize } from "./initialize";
import { paintUnavailable } from "./paintUnavailable";

const appContainer = initialize();
render(<App />, appContainer);
paintUnavailable();
