import { build } from "esbuild";
import { banner } from "./src/banner";

await build({
	entryPoints: ["src/index.tsx"],
	outfile: "wiggy.user.js",

	banner: { js: banner },
	bundle: true,
	minify: true,

	logLevel: "info",
});
