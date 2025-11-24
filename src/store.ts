import { atomWithStorage } from "jotai/utils";

export const projectParams = [
	"initialCost",
	"annualCost",
	"annualRevenue",
	"annualSavings",
	"salvageValue",
	"lifeSpan",
] as const;

export const formStore = {
	projectA: Object.fromEntries(
		projectParams.map((param) => [
			param,
			atomWithStorage<number>(
				`projectA_${param}`,
				param === "lifeSpan" ? 10 : 0,
			),
		]),
	) as Record<
		(typeof projectParams)[number],
		ReturnType<typeof atomWithStorage<number>>
	>,
	projectB: Object.fromEntries(
		projectParams.map((param) => [
			param,
			atomWithStorage<number>(
				`projectB_${param}`,
				param === "lifeSpan" ? 10 : 0,
			),
		]),
	) as Record<
		(typeof projectParams)[number],
		ReturnType<typeof atomWithStorage<number>>
	>,
	interestRate: atomWithStorage<number>("interestRate", 5),
};
