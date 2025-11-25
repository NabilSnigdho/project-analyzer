import "katex/dist/katex.min.css";
import { PrinterIcon } from "lucide-react";
import { useRef } from "react";
import { type Control, useWatch } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { Button } from "./components/ui/button";
import Lx from "./react-latex-next";
import type { FormSchema, ProjectSchema } from "./schema";

export function Output({ control }: { control: Control<FormSchema> }) {
	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });
	const projects = useWatch({
		name: "projects",
		control,
	});

	return (
		<div className="space-y-4 p-4">
			<h2 className="font-bold text-xl">Output</h2>
			<div className="space-y-4 border p-16" ref={contentRef}>
				<p>
					We calculate the Net Present Value (NPV) for the projects using the
					formula:
					<Lx>
						{
							"$$NPV = -C_0 + \\sum_{t=1}^{n} \\frac{A_t}{(1+r)^t} + \\frac{S_n}{(1+r)^n}$$"
						}
					</Lx>
				</p>
				{projects.map((x, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: is fine
					<p key={i}>
						<Lx>{`$NPV_{${i + 1}} = ${_npv(x, 0.1).toFixed(2)}$`}</Lx>
					</p>
				))}
			</div>
			<Button onClick={reactToPrintFn}>
				<PrinterIcon />
				Print Output
			</Button>
		</div>
	);
}

const _npv = (x: ProjectSchema, r: number) => {
	const A = x.annualRevenue - x.annualCost + x.annualSavings;
	const n = x.lifeSpan;

	return (
		-x.initialCost +
		(A * (1 - (1 + r) ** -n)) / r +
		x.salvageValue * (1 + r) ** -n
	);
};
