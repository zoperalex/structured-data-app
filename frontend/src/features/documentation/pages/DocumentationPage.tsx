import { PageHeader } from "../../../shared/components/PageHeader";

export function DocumentationPage() {
	return (
		<main className="page scrollbar-hidden">
			<PageHeader
				title="Documentation"
				subtitle="Everything you need to get the most out of JSONExtract."
			/>

			<div className="docs">
				<nav className="docs__nav">
					<p className="docs__nav-title">On this page</p>
					<a href="#what-is-jsonextract" className="docs__nav-link">
						What is JSONExtract?
					</a>
					<a href="#who-is-it-for" className="docs__nav-link">
						Who is it for?
					</a>
					<a href="#features" className="docs__nav-link">
						Features
					</a>
					<a href="#using-the-web-app" className="docs__nav-link">
						Using the web app
					</a>
					<a href="#presets" className="docs__nav-link">
						Presets
					</a>
					<a href="#schema-builder" className="docs__nav-link">
						Schema Builder
					</a>
					<a href="#api" className="docs__nav-link">
						API
					</a>
					<a href="#authentication" className="docs__nav-link">
						Authentication
					</a>
					<a href="#rate-limits" className="docs__nav-link">
						Rate Limits
					</a>
					<a href="#endpoint" className="docs__nav-link">
						Endpoint
					</a>
					<a href="#errors" className="docs__nav-link">
						Errors
					</a>
				</nav>

				<div className="docs__content">
					{/* WHAT IS JSONEXTRACT */}
					<section className="docs__section" id="what-is-jsonextract">
						<h2 className="docs__section-title">
							What is JSONExtract?
						</h2>
						<p className="docs__text">
							JSONExtract turns messy, unstructured text into
							clean, organised data. You give it a block of text —
							an email, a note, a report, anything — and tell it
							what information you want to pull out. It does the
							rest.
						</p>
						<p className="docs__text">
							The output is always a structured JSON object, which
							means it can plug directly into spreadsheets,
							databases, automations, or any other tool that works
							with data.
						</p>
						<p className="docs__text">
							Think of it as a smart highlighter. Instead of
							manually copying and pasting information from a wall
							of text, you tell JSONExtract what to look for and
							it finds it for you — every time, in the same
							format.
						</p>
					</section>

					{/* WHO IS IT FOR */}
					<section className="docs__section" id="who-is-it-for">
						<h2 className="docs__section-title">Who is it for?</h2>
						<p className="docs__text">
							JSONExtract is built for two kinds of people:
						</p>
						<p className="docs__text">
							<strong style={{ color: "#ffffff" }}>
								Non-technical users
							</strong>{" "}
							who regularly deal with unstructured text and want
							to extract specific information without building
							anything themselves. If you process invoices,
							emails, meeting notes, expense reports, or contact
							lists manually, JSONExtract can save you a lot of
							time.
						</p>
						<p className="docs__text">
							<strong style={{ color: "#ffffff" }}>
								Developers and technical users
							</strong>{" "}
							who want a simple API endpoint for structured data
							extraction without having to write and maintain
							their own prompt engineering logic. Generate an API
							key, send your text, get clean JSON back.
						</p>
					</section>

					{/* FEATURES */}
					<section className="docs__section" id="features">
						<h2 className="docs__section-title">Features</h2>
						<p className="docs__text">
							Here's what JSONExtract offers across all plans:
						</p>

						<h3 className="docs__subsection-title">Presets</h3>
						<p className="docs__text">
							Built-in extraction templates for common use cases —
							expense notes, task lists, and contact information.
							No setup required. Just paste your text and extract.
						</p>

						<h3 className="docs__subsection-title">
							Schema Builder
						</h3>
						<p className="docs__text">
							A visual tool for defining exactly what you want to
							extract. Add fields, name them descriptively, choose
							their type, and nest them inside each other for
							complex structures. No coding required.
						</p>

						<h3 className="docs__subsection-title">
							Saved Schemas
						</h3>
						<p className="docs__text">
							Save your custom schemas to your account and reuse
							them whenever you need them. Free accounts can save
							one schema. Pro and Business accounts can save more.
						</p>

						<h3 className="docs__subsection-title">API Access</h3>
						<p className="docs__text">
							Pro and Business accounts can generate API keys to
							use JSONExtract programmatically from their own
							applications or automation workflows.
						</p>

						<h3 className="docs__subsection-title">Plans</h3>
						<div className="docs__table-wrapper">
							<table className="docs__table">
								<thead>
									<tr>
										<th>Feature</th>
										<th>Free</th>
										<th>Pro ($5/mo)</th>
										<th>Business ($19/mo)</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Requests per hour</td>
										<td>50</td>
										<td>100</td>
										<td>500</td>
									</tr>
									<tr>
										<td>Saved schemas</td>
										<td>1</td>
										<td>5</td>
										<td>20</td>
									</tr>
									<tr>
										<td>API keys</td>
										<td>—</td>
										<td>1</td>
										<td>3</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>

					{/* USING THE WEB APP */}
					<section className="docs__section" id="using-the-web-app">
						<h2 className="docs__section-title">
							Using the web app
						</h2>
						<p className="docs__text">
							The web app is the easiest way to use JSONExtract.
							No account required to get started — just open the
							app and start extracting.
						</p>
						<p className="docs__text">
							The interface is split into three panels:
						</p>
						<p className="docs__text">
							<strong style={{ color: "#ffffff" }}>Input</strong>{" "}
							— paste the text you want to extract information
							from. This can be anything: an email, a note, a
							copied paragraph, a report. The longer and messier
							the text, the more useful JSONExtract becomes.
						</p>
						<p className="docs__text">
							<strong style={{ color: "#ffffff" }}>Mode</strong> —
							choose between Preset mode and User Defined mode.
							Preset mode uses one of the built-in templates. User
							Defined mode lets you build your own schema using
							the Schema Builder.
						</p>
						<p className="docs__text">
							<strong style={{ color: "#ffffff" }}>Output</strong>{" "}
							— after clicking Extract Data, your structured
							result appears here as a JSON object. You can copy
							it directly and use it wherever you need it.
						</p>
					</section>

					{/* PRESETS */}
					<section className="docs__section" id="presets">
						<h2 className="docs__section-title">Presets</h2>
						<p className="docs__text">
							Presets are ready-made extraction templates for
							common scenarios. Select a preset, paste your text,
							and click Extract Data.
						</p>

						<h3 className="docs__subsection-title">Expense Note</h3>
						<p className="docs__text">
							Extracts expense items from financial text —
							including the type of expense, amount, currency, and
							payment status.
						</p>
						<pre className="docs__code">{`// Example input
"Rent 900 EUR paid. Electricity 110 EUR overdue. Internet 45 EUR pending."

// Output
{
  "input_text": "Rent 900 EUR paid. Electricity 110 EUR overdue. Internet 45 EUR pending.",
  "mode": "preset",
  "preset": "expense_note",
  "result": {
    "category": "expense_note",
    "items": [
      { "type": "Rent", "amount": 900.0, "currency": "EUR", "status": "Paid" },
      { "type": "Electricity", "amount": 110.0, "currency": "EUR", "status": "Overdue" },
      { "type": "Internet", "amount": 45.0, "currency": "EUR", "status": "Pending" }
    ]
  }
}`}</pre>

						<h3 className="docs__subsection-title">Task List</h3>
						<p className="docs__text">
							Extracts tasks, assignees, due dates, and statuses
							from plain text descriptions — useful for meeting
							notes and project updates.
						</p>
						<pre className="docs__code">{`// Example input
"John needs to finish the report by Friday. Sarah to review it Monday."

// Output
{
  "input_text": "John needs to finish the report by Friday. Sarah to review it Monday.",
  "mode": "preset",
  "preset": "task_list",
  "result": {
    "category": "task_list",
    "items": [
      { "task": "Finish the report", "assignee": "John", "due_date": "Friday", "status": null },
      { "task": "Review the report", "assignee": "Sarah", "due_date": "Monday", "status": null }
    ]
  }
}`}</pre>

						<h3 className="docs__subsection-title">Contact Info</h3>
						<p className="docs__text">
							Extracts contact details — name, email, phone
							number, and company — from any block of text.
						</p>
						<pre className="docs__code">{`// Example input
"Reach me at john@example.com or call 555-1234. I work at Acme Corp."

// Output
{
  "input_text": "Reach me at john@example.com or call 555-1234. I work at Acme Corp.",
  "mode": "preset",
  "preset": "contact_info",
  "result": {
    "category": "contact_info",
    "items": [
      {
        "name": null,
        "email": "john@example.com",
        "phone": "555-1234",
        "company": "Acme Corp"
      }
    ]
  }
}`}</pre>
					</section>

					{/* SCHEMA BUILDER */}
					<section className="docs__section" id="schema-builder">
						<h2 className="docs__section-title">Schema Builder</h2>
						<p className="docs__text">
							The Schema Builder lets you define exactly what you
							want to extract. Instead of being limited to the
							built-in presets, you can describe your own
							structure — field by field.
						</p>

						<h3 className="docs__subsection-title">
							Adding fields
						</h3>
						<p className="docs__text">
							Click{" "}
							<strong style={{ color: "#ffffff" }}>
								Add field
							</strong>{" "}
							and choose a field type. Give the field a clear,
							descriptive name — the more descriptive the name,
							the better the extraction results. For example,{" "}
							<code className="docs__inline-code">
								invoice_total_amount
							</code>{" "}
							will produce better results than{" "}
							<code className="docs__inline-code">amount</code>.
						</p>

						<h3 className="docs__subsection-title">Field types</h3>
						<div className="docs__table-wrapper">
							<table className="docs__table">
								<thead>
									<tr>
										<th>Type</th>
										<th>Use it for</th>
										<th>Example</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<code className="docs__inline-code">
												string
											</code>
										</td>
										<td>Any text value</td>
										<td>Names, addresses, descriptions</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												int
											</code>
										</td>
										<td>Whole numbers</td>
										<td>Quantities, counts, years</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												float
											</code>
										</td>
										<td>Decimal numbers</td>
										<td>Prices, amounts, measurements</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												boolean
											</code>
										</td>
										<td>True or false values</td>
										<td>Is paid, is urgent, in stock</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												object
											</code>
										</td>
										<td>Nested groups of fields</td>
										<td>
											An address with street, city,
											postcode
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<h3 className="docs__subsection-title">
							Nested fields
						</h3>
						<p className="docs__text">
							Object fields can contain child fields, letting you
							build nested structures. For example, a{" "}
							<code className="docs__inline-code">seller</code>{" "}
							object could contain{" "}
							<code className="docs__inline-code">
								seller_name
							</code>{" "}
							and{" "}
							<code className="docs__inline-code">
								seller_email
							</code>{" "}
							as children.
						</p>

						<h3 className="docs__subsection-title">
							Saving schemas
						</h3>
						<p className="docs__text">
							Once you've built a schema you want to reuse, click{" "}
							<strong style={{ color: "#ffffff" }}>
								Save schema
							</strong>
							, give it a name, and it will be saved to your
							account. You can load it again from the dropdown at
							the top of the Schema Builder at any time. Saved
							schema IDs are visible in your{" "}
							<a href="/dashboard" className="docs__link">
								Dashboard
							</a>{" "}
							— you'll need these if you're using the API.
						</p>

						<h3 className="docs__subsection-title">Example</h3>
						<pre className="docs__code">{`// Schema with fields: product_name (string), price (float), in_stock (boolean)
// Input text: "The Pro Keyboard is available for 79.99 and currently in stock."

// Output
{
  "input_text": "The Pro Keyboard is available for 79.99 and currently in stock.",
  "mode": "user_defined",
  "preset": null,
  "result": {
    "product_name": "Pro Keyboard",
    "price": 79.99,
    "in_stock": true
  }
}`}</pre>
					</section>

					{/* API */}
					<section className="docs__section" id="api">
						<h2 className="docs__section-title">API</h2>
						<p className="docs__text">
							The JSONExtract API lets you integrate structured
							data extraction directly into your own applications,
							scripts, or automation workflows. Available on Pro
							and Business plans.
						</p>
						<p className="docs__text">
							The base URL for all API requests is:
						</p>
						<pre className="docs__code">
							https://api.jsonextract.com
						</pre>
					</section>

					{/* AUTHENTICATION */}
					<section className="docs__section" id="authentication">
						<h2 className="docs__section-title">Authentication</h2>
						<p className="docs__text">
							API requests are authenticated using an API key.
							Generate one from your{" "}
							<a href="/dashboard" className="docs__link">
								Dashboard
							</a>{" "}
							and include it in the{" "}
							<code className="docs__inline-code">X-API-Key</code>{" "}
							header of every request.
						</p>
						<pre className="docs__code">{`POST /api/extract
X-API-Key: sde_your_api_key_here
Content-Type: application/json`}</pre>
						<p className="docs__text">
							Keep your API key private. Anyone with your key can
							make requests on your behalf and consume your rate
							limit. If a key is compromised, revoke it from your
							Dashboard and generate a new one.
						</p>
					</section>

					{/* RATE LIMITS */}
					<section className="docs__section" id="rate-limits">
						<h2 className="docs__section-title">Rate Limits</h2>
						<p className="docs__text">
							Rate limits are applied per hour based on your
							account tier. API key requests use your account's
							tier limit.
						</p>
						<div className="docs__table-wrapper">
							<table className="docs__table">
								<thead>
									<tr>
										<th>Tier</th>
										<th>Requests per hour</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>No account</td>
										<td>10</td>
									</tr>
									<tr>
										<td>Free</td>
										<td>50</td>
									</tr>
									<tr>
										<td>Pro</td>
										<td>100</td>
									</tr>
									<tr>
										<td>Business</td>
										<td>500</td>
									</tr>
								</tbody>
							</table>
						</div>
						<p className="docs__text">
							When you exceed your rate limit, the API returns a{" "}
							<code className="docs__inline-code">429</code>{" "}
							response with a message telling you your limit and
							when it resets.
						</p>
					</section>

					{/* ENDPOINT */}
					<section className="docs__section" id="endpoint">
						<h2 className="docs__section-title">Endpoint</h2>
						<div className="docs__endpoint">
							<span className="docs__method">POST</span>
							<code className="docs__path">/api/extract</code>
						</div>
						<p className="docs__text">
							Extracts structured data from text using either a
							preset or a saved schema.
						</p>

						<h3 className="docs__subsection-title">Request body</h3>
						<pre className="docs__code">{`{
  "mode": "preset" | "user_defined",
  "preset": "expense_note" | "task_list" | "contact_info" | null,
  "schema_id": number | null,
  "text": "Your input text here"
}`}</pre>

						<h3 className="docs__subsection-title">
							Using a preset
						</h3>
						<p className="docs__text">
							Set <code className="docs__inline-code">mode</code>{" "}
							to{" "}
							<code className="docs__inline-code">"preset"</code>,
							choose a preset name, and set{" "}
							<code className="docs__inline-code">schema_id</code>{" "}
							to <code className="docs__inline-code">null</code>.
						</p>
						<pre className="docs__code">{`{
  "mode": "preset",
  "preset": "expense_note",
  "schema_id": null,
  "text": "Rent 900 EUR paid. Electricity 110 EUR overdue."
}`}</pre>

						<h3 className="docs__subsection-title">
							Using a saved schema
						</h3>
						<p className="docs__text">
							Set <code className="docs__inline-code">mode</code>{" "}
							to{" "}
							<code className="docs__inline-code">
								"user_defined"
							</code>
							, set{" "}
							<code className="docs__inline-code">preset</code> to{" "}
							<code className="docs__inline-code">null</code>, and
							provide your schema's ID. You can find schema IDs in
							your{" "}
							<a href="/dashboard" className="docs__link">
								Dashboard
							</a>
							.
						</p>
						<pre className="docs__code">{`{
  "mode": "user_defined",
  "preset": null,
  "schema_id": 42,
  "text": "The Pro Keyboard is available for 79.99 and currently in stock."
}`}</pre>

						<h3 className="docs__subsection-title">Response</h3>
						<pre className="docs__code">{`{
  "input_text": "Your input text here",
  "mode": "preset" | "user_defined",
  "preset": "expense_note" | "task_list" | "contact_info" | null,
  "result": { ... }
}`}</pre>
					</section>

					{/* ERRORS */}
					<section className="docs__section" id="errors">
						<h2 className="docs__section-title">Errors</h2>
						<p className="docs__text">
							All error responses return a JSON object with an{" "}
							<code className="docs__inline-code">error</code>{" "}
							field describing what went wrong. Here's what each
							status code means:
						</p>
						<div className="docs__table-wrapper">
							<table className="docs__table">
								<thead>
									<tr>
										<th>Status</th>
										<th>Meaning</th>
										<th>What to do</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<code className="docs__inline-code">
												400
											</code>
										</td>
										<td>Bad request</td>
										<td>
											Check your request body — a required
											field may be missing or invalid
										</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												401
											</code>
										</td>
										<td>Unauthorised</td>
										<td>
											Your API key is missing or invalid —
											check it in your Dashboard
										</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												404
											</code>
										</td>
										<td>Not found</td>
										<td>
											The schema ID you provided doesn't
											exist or doesn't belong to your
											account
										</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												429
											</code>
										</td>
										<td>Rate limit exceeded</td>
										<td>
											You've hit your hourly request limit
											— wait an hour or upgrade your plan
										</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												500
											</code>
										</td>
										<td>Server error</td>
										<td>
											Something went wrong on our end —
											try again in a moment
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
