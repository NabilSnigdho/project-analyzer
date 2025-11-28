import type React from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./components/ui/table";
import Lx from "./react-latex-next";

interface ProjectData {
	initialCost: number;
	lifeSpan: number;
	salvageValue: number;
	annualRevenue: number;
	annualCost: number;
	annualSavings: number;
}

interface Props {
	projectA: ProjectData;
	projectB: ProjectData;
}

interface CashFlowRow {
	year: string;
	projectA: string;
	projectB: string;
	incremental: string;
}

const withPlusSign = (value: number): string =>
	value < 0 ? value.toLocaleString() : `+${value.toLocaleString()}`;

export const IncrementalAnalysis: React.FC<Props> = ({
	projectA,
	projectB,
}) => {
	const gcd = (a: number, b: number): number => {
		return b === 0 ? a : gcd(b, a % b);
	};

	const lcm = (a: number, b: number): number => {
		return (a * b) / gcd(a, b);
	};

	const formatCashFlow = (values: number[]): string => {
		if (values.length === 0) return "0";
		if (values.length === 1) return withPlusSign(values[0]);
		return values.map((v) => v.toLocaleString()).join(" + ");
	};

	const evaluateCashFlow = (expression: string): number => {
		const values = expression
			.split(" + ")
			.map((v) => parseFloat(v.replace(/,/g, "")));
		return values.reduce((sum, val) => sum + val, 0);
	};

	const generateCashFlowTable = (): CashFlowRow[] => {
		const lifeSpanLCM = lcm(projectA.lifeSpan, projectB.lifeSpan);

		const cashFlowsA: { year: number; values: number[] }[] = [];
		const cashFlowsB: { year: number; values: number[] }[] = [];

		// Year 0
		cashFlowsA.push({ year: 0, values: [-projectA.initialCost] });
		cashFlowsB.push({ year: 0, values: [-projectB.initialCost] });

		// Years 1 to LCM
		for (let year = 1; year <= lifeSpanLCM; year++) {
			const valuesA: number[] = [];
			const valuesB: number[] = [];

			// Project A
			const yearInCycleA = ((year - 1) % projectA.lifeSpan) + 1;
			const netAnnualA =
				projectA.annualRevenue - projectA.annualCost + projectA.annualSavings;

			if (yearInCycleA === projectA.lifeSpan) {
				valuesA.push(netAnnualA);
				valuesA.push(projectA.salvageValue);
				if (year < lifeSpanLCM) {
					valuesA.push(-projectA.initialCost);
				}
			} else {
				valuesA.push(netAnnualA);
			}

			// Project B
			const yearInCycleB = ((year - 1) % projectB.lifeSpan) + 1;
			const netAnnualB =
				projectB.annualRevenue - projectB.annualCost + projectB.annualSavings;

			if (yearInCycleB === projectB.lifeSpan) {
				valuesB.push(netAnnualB);
				valuesB.push(projectB.salvageValue);
				if (year < lifeSpanLCM) {
					valuesB.push(-projectB.initialCost);
				}
			} else {
				valuesB.push(netAnnualB);
			}

			cashFlowsA.push({ year, values: valuesA });
			cashFlowsB.push({ year, values: valuesB });
		}

		// Consolidate consecutive years with same cash flows
		const rows: CashFlowRow[] = [];
		let i = 0;

		while (i < cashFlowsA.length) {
			const currentA = formatCashFlow(cashFlowsA[i].values);
			const currentB = formatCashFlow(cashFlowsB[i].values);

			let j = i + 1;
			while (
				j < cashFlowsA.length &&
				formatCashFlow(cashFlowsA[j].values) === currentA &&
				formatCashFlow(cashFlowsB[j].values) === currentB
			) {
				j++;
			}

			const yearLabel =
				i === j - 1
					? cashFlowsA[i].year.toString()
					: `${cashFlowsA[i].year}-${cashFlowsA[j - 1].year}`;

			const sumA = evaluateCashFlow(currentA);
			const sumB = evaluateCashFlow(currentB);
			const incremental = sumB - sumA;

			rows.push({
				year: yearLabel,
				projectA: currentA,
				projectB: currentB,
				incremental: withPlusSign(incremental),
			});

			i = j;
		}

		return rows;
	};

	const calculateIRR = (cashFlows: number[]): number | null => {
		// Newton-Raphson method to find IRR
		const maxIterations = 1000;
		const tolerance = 0.00001;
		let rate = 0.1; // Initial guess

		for (let i = 0; i < maxIterations; i++) {
			let npv = 0;
			let dnpv = 0;

			for (let t = 0; t < cashFlows.length; t++) {
				npv += cashFlows[t] / (1 + rate) ** t;
				dnpv -= (t * cashFlows[t]) / (1 + rate) ** (t + 1);
			}

			const newRate = rate - npv / dnpv;

			if (Math.abs(newRate - rate) < tolerance) {
				return newRate * 100; // Return as percentage
			}

			rate = newRate;
		}

		{
			const maxIterations = 1000000;
			const tolerance = 0.001;
			let rate = 0.1; // Initial guess

			for (let i = 0; i < maxIterations; i++) {
				let npv = 0;
				let dnpv = 0;

				for (let t = 0; t < cashFlows.length; t++) {
					npv += cashFlows[t] / (1 + rate) ** t;
					dnpv -= (t * cashFlows[t]) / (1 + rate) ** (t + 1);
				}

				const newRate = rate - npv / dnpv;

				if (Math.abs(newRate - rate) < tolerance) {
					return newRate * 100; // Return as percentage
				}

				rate = newRate;
			}
		}

		return null; // Could not converge
	};

	const cashFlowTable = generateCashFlowTable();
	// const _lifeSpanLCM = lcm(projectA.lifeSpan, projectB.lifeSpan);

	// Calculate IRR for incremental cash flows
	const incrementalCashFlows: number[] = [];
	cashFlowTable.forEach((row) => {
		const years = row.year.includes("-")
			? parseInt(row.year.split("-")[1], 10) -
				parseInt(row.year.split("-")[0], 10) +
				1
			: 1;

		const incrementalValue = evaluateCashFlow(row.incremental);
		for (let i = 0; i < years; i++) {
			incrementalCashFlows.push(incrementalValue);
		}
	});

	const irr = calculateIRR(incrementalCashFlows);

	return (
		<>
			<h3>Incremental Analysis</h3>
			<Table>
				<TableCaption>Incremental Cash Flow</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Year</TableHead>
						<TableHead>Project A Cash Flow</TableHead>
						<TableHead>Project B Cash Flow</TableHead>
						<TableHead>Incremental (B - A)</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{cashFlowTable.map((row, index) => (
						<TableRow
							key={index}
							className={`border-gray-200 border-b transition-colors hover:bg-gray-50 ${
								index % 2 === 0 ? "bg-white" : "bg-gray-25"
							}`}
						>
							<TableCell>{row.year}</TableCell>
							<TableCell>{row.projectA}</TableCell>
							<TableCell>{row.projectB}</TableCell>
							<TableCell>{row.incremental}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<p>
				<Lx>$ROR,\ i^* ={irr !== null ? `${irr.toFixed(2)}\\%` : "N/A"}$</Lx>
			</p>
		</>
	);
};
