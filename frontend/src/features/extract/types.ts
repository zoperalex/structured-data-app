export type TransactionItem = {
	type: string;
	amount: number;
	currency: string;
	status: string;
};

export type TransactionExtractionResult = {
	category: "expense_note";
	items: TransactionItem[];
};

export type ExtractResponse = {
	mode: "preset";
	input_text: string | null;
	result: TransactionExtractionResult;
};

export type ErrorResponse = {
	error: string;
	details?: unknown;
};