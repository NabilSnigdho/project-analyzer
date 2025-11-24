import { useAtom, type WritableAtom } from "jotai";
import type { RESET } from "jotai/utils";
import { useId } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function NumberField<
	S extends number,
	T extends WritableAtom<S, [S | typeof RESET], void>,
>({
	atom,
	...props
}: {
	atom: T;
	label: string;
} & React.ComponentProps<typeof Input>) {
	const id = useId();
	const [value, setValue] = useAtom(atom);

	return (
		<Field orientation="horizontal">
			<FieldLabel htmlFor={id} className="w-48">
				{props.label}
			</FieldLabel>
			<Input
				id={id}
				value={value}
				onChange={(event) => setValue(+event.currentTarget.value as S)}
				{...props}
			/>
		</Field>
	);
}
