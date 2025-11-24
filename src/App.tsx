import { Form } from "./Form";
import { Output } from "./Output";

function App() {
	return (
		<div className="fixed inset-0 flex max-lg:flex-col">
			<div className="flex-1 overflow-y-auto">
				<h1 className="p-4 font-bold text-2xl">Project Analyzer</h1>
				<Form />
			</div>
			<div className="flex-1">
				<Output />
			</div>
		</div>
	);
}

export default App;
