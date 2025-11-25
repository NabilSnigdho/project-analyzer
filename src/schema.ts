import z from "zod";

export const projectSchema = z.object({
	initialCost: z.number().min(0),
	annualCost: z.number().min(0),
	annualRevenue: z.number().min(0),
	annualSavings: z.number().min(0),
	salvageValue: z.number().min(0),
	lifeSpan: z.number().min(1),
});

export const formSchema = z.object({
	projects: z.array(projectSchema),
	discountRate: z.number().min(0),
});

export type ProjectSchema = z.infer<typeof projectSchema>;
export type FormSchema = z.infer<typeof formSchema>;
