export const PRESET_EXAMPLES = {
	expense_note: {
		"input_text": "Rent 900 EUR paid. Electricity 110 EUR overdue. Internet 45 EUR pending.",
		"mode": "preset",
		"preset": "expense_note",
		"result": {
			"category": "expense_note",
			"items": [
			{
				"amount": 900,
				"currency": "EUR",
				"status": "Paid",
				"type": "Rent"
			},
			{
				"amount": 110,
				"currency": "EUR",
				"status": "Overdue",
				"type": "Electricity"
			},
			{
				"amount": 45,
				"currency": "EUR",
				"status": "Pending",
				"type": "Internet"
			}
			]
		}
	},
	task_list: {
		"input_text": "Alex should finish the README by Friday. Maria needs to deploy the backend tomorrow.",
		"mode": "preset",
		"preset": "task_list",
		"result": {
			"category": "task_list",
			"items": [
			{
				"assignee": "Alex",
				"due_date": "Friday",
				"status": "Pending",
				"task": "Finish the README"
			},
			{
				"assignee": "Maria",
				"due_date": "tomorrow",
				"status": "Pending",
				"task": "Deploy the backend"
			}
			]
		}
	},
	contact_info: {
		"input_text": "John Smith works at Welltech. Email: john.smith@example.com. Phone: +357 99 123456.",
		"mode": "preset",
		"preset": "contact_info",
		"result": {
			"category": "contact_info",
			"items": [
			{
				"company": "Welltech",
				"email": "john.smith@example.com",
				"name": "John Smith",
				"phone": "+357 99 123456"
			}
			]
		}
	}
} as const;