import { getDefaultStore, useAtomValue } from "jotai";
import { PrinterIcon } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "./components/ui/button";
import { formStore, projectParams } from "./store";

export function Output() {
	const aValues = Object.fromEntries(
		// biome-ignore lint/correctness/useHookAtTopLevel: projectParams is static
		projectParams.map((x) => [x, useAtomValue(formStore.projectA[x])]),
	) as Record<(typeof projectParams)[number], number>;
	const bValues = Object.fromEntries(
		// biome-ignore lint/correctness/useHookAtTopLevel: projectParams is static
		projectParams.map((x) => [x, useAtomValue(formStore.projectB[x])]),
	) as Record<(typeof projectParams)[number], number>;

	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });

	return (
		<div className="space-y-4">
			<h2 className="p-4 font-bold text-xl">Output</h2>
			<div className="space-y-4 p-4" ref={contentRef}>
				<p>
					Net Present Value (NPV) of <b>Project A = </b>$
					<i>{npv(aValues).toFixed(2)}</i>
				</p>
				<p>
					Net Present Value (NPV) of <b>Project B = </b>$
					<i>{npv(bValues).toFixed(2)}</i>
				</p>
			</div>
			<Button onClick={reactToPrintFn}>
				<PrinterIcon />
				Print Output
			</Button>
		</div>
	);
}

const npv = (x: Record<(typeof projectParams)[number], number>) => {
	const r = getDefaultStore().get(formStore.interestRate) / 100;
	const A = x.annualRevenue - x.annualCost + x.annualSavings;

	return (
		-x.initialCost +
		A * ((1 - (1 + r) ** -x.lifeSpan) / r) +
		x.salvageValue * (1 + r) ** -x.lifeSpan
	);
};
