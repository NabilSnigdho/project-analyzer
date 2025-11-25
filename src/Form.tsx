import { sentenceCase } from "change-case";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { Control, FieldPath } from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";
import { Button } from "./components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "./components/ui/field";
import { Input } from "./components/ui/input";
import Lx from "./react-latex-next";
import type { FormSchema } from "./schema";

function F({
	control,
	name,
	symbol,
}: {
	control: Control<FormSchema>;
	name: FieldPath<FormSchema>;
	symbol?: string;
}) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>
						{sentenceCase(name.split(".").pop() || name)}
						{symbol && <Lx>{symbol}</Lx>}
					</FieldLabel>
					<Input
						/** biome-ignore lint/suspicious/noExplicitAny: it's fine */
						{...(field as any)}
						id={name}
						type="number"
						onChange={(event) => field.onChange(+event.target.value)}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}

export function Form({ control }: { control: Control<FormSchema> }) {
	const { fields, append, remove, move } = useFieldArray({
		control,
		name: "projects",
	});
	return (
		<div className="space-y-4 p-4">
			{fields.map((field, i) => (
				<FieldSet key={field.id}>
					<div className="flex items-center gap-2">
						<FieldLegend className="me-auto">
							Project {String.fromCharCode(65 + i)}
						</FieldLegend>
						<Button
							variant="outline"
							onClick={() => move(i, i - 1)}
							size="icon"
							disabled={i === 0}
						>
							<ArrowUpIcon />
						</Button>
						<Button
							variant="outline"
							onClick={() => move(i, i + 1)}
							size="icon"
							disabled={i === fields.length - 1}
						>
							<ArrowDownIcon />
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								confirm("Are you sure you want to delete this project?") &&
								remove(i)
							}
							size="icon"
							className="text-red-500"
						>
							<Trash2Icon />
						</Button>
					</div>
					<FieldGroup className="grid grid-cols-3 gap-4">
						<F
							control={control}
							name={`projects.${i}.initialCost`}
							symbol="$C_0$"
						/>
						<F control={control} name={`projects.${i}.lifeSpan`} symbol="$n$" />
						<F
							control={control}
							name={`projects.${i}.salvageValue`}
							symbol="$S$"
						/>
						<F control={control} name={`projects.${i}.annualRevenue`} />
						<F control={control} name={`projects.${i}.annualCost`} />
						<F control={control} name={`projects.${i}.annualSavings`} />
					</FieldGroup>
					<hr className="-mx-4 my-4" />
				</FieldSet>
			))}
			<Button
				onClick={() =>
					append({
						initialCost: 0,
						annualCost: 0,
						annualRevenue: 0,
						annualSavings: 0,
						salvageValue: 0,
						lifeSpan: 1,
					})
				}
				variant="outline"
				className="w-full"
			>
				<PlusIcon /> Add Project
			</Button>
			<F control={control} name="discountRate" />
		</div>
	);
}
