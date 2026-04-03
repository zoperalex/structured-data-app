export type ModeName = "preset" | "user_defined";
export type PresetName = "expense_note" | "task_list" | "contact_info";
export type FieldType = "string" | "int" | "float" | "boolean" | "object";

export type SchemaField = {
	id: string;
	name: string;
	type: FieldType;
	children: SchemaField[];
};

export type ExtractRequest = {
	mode: ModeName;
	preset: PresetName | null;
	schema: SchemaField[] | null;
	text: string;
};

export type TransactionItem = {
	type: string;
	amount: number;
	currency: string;
	status: "Paid" | "Pending" | "Overdue";
};

export type TransactionExtractionResult = {
	category: "expense_note";
	items: TransactionItem[];
};

export type TaskItem = {
	task: string;
	assignee: string | null;
	due_date: string | null;
	status: string | null;
};

export type TaskListResult = {
	category: "task_list";
	items: TaskItem[];
};

export type ContactInfoItem = {
	name: string | null;
	email: string | null;
	phone: string | null;
	company: string | null;
};

export type ContactInfoResult = {
	category: "contact_info";
	items: ContactInfoItem[];
};

export type ExtractResult =
	| TransactionExtractionResult
	| TaskListResult
	| ContactInfoResult;

export type ExtractResponse = {
	mode: "preset";
	preset: PresetName;
	result: ExtractResult;
	input_text: string | null;
};

export type ErrorResponse = {
	error: string;
	details?: unknown;
};