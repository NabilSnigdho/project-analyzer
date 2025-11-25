import renderLatex, { type Macros } from "./renderLatex";
import type { Delimiter } from "./types";
import "./Latex.css";

export interface LatexProps {
	children: string | string[];
	delimiters?: Delimiter[];
	strict?: boolean;
	macros?: Macros;
}

const defaultDelimiters = [
	{ left: "$$", right: "$$", display: true },
	{ left: "\\(", right: "\\)", display: false },
	{ left: "$", right: "$", display: false },
	{ left: "\\[", right: "\\]", display: true },
];

export default function Latex({
	children,
	delimiters = defaultDelimiters,
	strict = false,
	macros,
}: LatexProps) {
	const renderedLatex = renderLatex(
		Array.isArray(children) ? children.join("") : children,
		delimiters,
		strict,
		macros,
	);
	return (
		<span
			className="__Latex__"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: needed for rendering latex
			dangerouslySetInnerHTML={{ __html: renderedLatex }}
		/>
	);
}
