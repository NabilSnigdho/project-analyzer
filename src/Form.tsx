import { sentenceCase } from "change-case";
import { NumberField } from "./components/custom/NumberField";
import { FieldGroup, FieldLegend, FieldSet } from "./components/ui/field";
import { formStore, projectParams } from "./store";

function F({
	param,
	project,
}: {
	param: (typeof projectParams)[number];
	project: "A" | "B";
}) {
	return (
		<NumberField
			atom={formStore[project === "B" ? "projectB" : "projectA"][param]}
			label={sentenceCase(param)}
			type="number"
			min={0}
		/>
	);
}

export function Form() {
	return (
		<form
			className="w-full space-y-6 p-4"
			onSubmit={(event) => event.preventDefault()}
		>
			<div className="grid grid-cols-2 gap-16">
				<FieldSet>
					<FieldLegend>Project A</FieldLegend>
					<FieldGroup>
						{projectParams.map((param) => (
							<F key={param} param={param} project="A" />
						))}
					</FieldGroup>
				</FieldSet>
				<FieldSet>
					<FieldLegend>Project B</FieldLegend>
					<FieldGroup>
						{projectParams.map((param) => (
							<F key={param} param={param} project="B" />
						))}
					</FieldGroup>
				</FieldSet>
			</div>
			<NumberField
				atom={formStore.interestRate}
				label="Interest Rate (%)"
				type="number"
				min={0}
			/>
		</form>
	);
}
