import "katex/dist/katex.min.css";
import Lx from "./react-latex-next";
import type { ProjectSchema } from "./schema";

export function NPVCalculation({
	projects,
	discountRate,
}: {
	projects: ProjectSchema[];
	discountRate: number;
}) {
	return (
		<>
			<h3>NPV Calculation</h3>
			<p>
				The Net Present Value (NPV) for the projects are calculated using the
				formula:
				<Lx>
					{
						"$$NPV = -C_0 + \\sum_{t=1}^{n} \\frac{A_t}{(1+r)^t} + \\frac{S}{(1+r)^n}$$"
					}
				</Lx>
				Where
				<Lx>{"$$A_t = A_{revenue} - A_{cost} + A_{savings}$$"}</Lx>
			</p>
			{!!projects.length && <h4>Results</h4>}
			{projects.map((x, i) => (
				<p key={i}>
					<Lx>{`$NPV_{${String.fromCharCode(65 + i)}} = ${_npv(
						x,
						discountRate / 100,
					).toFixed(2)}$`}</Lx>
				</p>
			))}
		</>
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
