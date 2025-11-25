import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Form } from "./Form";
import { Output } from "./Output";
import { type FormSchema, formSchema } from "./schema";

function local(key: string) {
	const item = localStorage.getItem(key);
	try {
		return item ? JSON.parse(item) : undefined;
	} catch (error) {
		console.error(error);
		return undefined;
	}
}

function App() {
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			projects: local("projects") ?? [],
			discountRate: local("discountRate") ?? 5,
		},
	});

	function onSubmit(data: z.infer<typeof formSchema>) {
		// Do something with the form values.
		console.log(data);
	}

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="fixed inset-0 flex max-lg:flex-col"
		>
			<div className="flex-1 overflow-y-auto">
				<h1 className="p-4 font-bold text-2xl">Project Analyzer</h1>
				<Form control={form.control} />
			</div>
			<div className="flex-1 overflow-y-auto">
				<Output control={form.control} />
			</div>
		</form>
	);
}

export default App;
