import "katex/dist/katex.min.css";
import { PrinterIcon } from "lucide-react";
import { useRef } from "react";
import { type Control, useWatch } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { Button } from "./components/ui/button";
import { IncrementalAnalysis } from "./IncrementalAnalysis";
import { NPVCalculation } from "./NPVCalculation";
import type { FormSchema } from "./schema";

export function Output({ control }: { control: Control<FormSchema> }) {
	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });
	const projects = useWatch({ name: "projects", control });
	const discountRate = useWatch({ name: "discountRate", control });
	localStorage.setItem("projects", JSON.stringify(projects));
	localStorage.setItem("discountRate", JSON.stringify(discountRate));

	return (
		<div className="space-y-4 p-4">
			<div className="flex items-center gap-4">
				<h2 className="me-auto font-bold text-xl">Output</h2>
				<Button onClick={reactToPrintFn}>
					<PrinterIcon />
					Print Output
				</Button>
			</div>
			<div
				className="prose lg:prose-xl max-w-full border bg-white p-16 shadow"
				ref={contentRef}
			>
				<NPVCalculation projects={projects} discountRate={discountRate} />
				{projects.length >= 2 && (
					<IncrementalAnalysis projectA={projects[0]} projectB={projects[1]} />
				)}
			</div>
		</div>
	);
}
