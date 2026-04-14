import { PageHeader } from "../../../shared/components/PageHeader";

export function DocumentationPage() {
	return (
		<main className="page scrollbar-hidden">
			<PageHeader
				title="Documentation"
				subtitle="Everything you need to integrate the Structured Data Extractor."
			/>

			<div className="docs">
				<nav className="docs__nav">
					<p className="docs__nav-title">On this page</p>
					<a href="#overview" className="docs__nav-link">
						Overview
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
					<a href="#presets" className="docs__nav-link">
						Presets
					</a>
					<a href="#user-defined" className="docs__nav-link">
						User Defined Schemas
					</a>
					<a href="#errors" className="docs__nav-link">
						Errors
					</a>
				</nav>

				<div className="docs__content">
					{/* OVERVIEW */}
					<section className="docs__section" id="overview">
						<h2 className="docs__section-title">Overview</h2>
						<p className="docs__text">
							The Structured Data Extractor API lets you extract
							structured JSON from unstructured natural language
							text. You can use built-in presets for common
							extraction tasks, or define your own schema using
							the{" "}
							<a href="/" className="docs__link">
								Schema Builder
							</a>{" "}
							and reference it by ID in your requests.
						</p>
						<p className="docs__text">
							The base URL for all API requests is:
						</p>
						<pre className="docs__code">
							https://your-domain.com
						</pre>
					</section>

					{/* AUTHENTICATION */}
					<section className="docs__section" id="authentication">
						<h2 className="docs__section-title">Authentication</h2>
						<p className="docs__text">
							All API requests require an API key. You can
							generate one from your{" "}
							<a href="/dashboard" className="docs__link">
								Dashboard
							</a>{" "}
							once you are on the Pro or Business tier.
						</p>
						<p className="docs__text">
							Pass your API key in the{" "}
							<code className="docs__inline-code">X-API-Key</code>{" "}
							header with every request:
						</p>
						<pre className="docs__code">{`POST /api/extract
X-API-Key: sde_your_api_key_here
Content-Type: application/json`}</pre>
					</section>

					{/* RATE LIMITS */}
					<section className="docs__section" id="rate-limits">
						<h2 className="docs__section-title">Rate Limits</h2>
						<p className="docs__text">
							Rate limits are applied per hour based on your
							account tier.
						</p>
						<div className="docs__table-wrapper">
							<table className="docs__table">
								<thead>
									<tr>
										<th>Tier</th>
										<th>Requests per hour</th>
										<th>Saved schemas</th>
										<th>API keys</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Free</td>
										<td>50</td>
										<td>1</td>
										<td>—</td>
									</tr>
									<tr>
										<td>Pro</td>
										<td>100</td>
										<td>5</td>
										<td>1</td>
									</tr>
									<tr>
										<td>Business</td>
										<td>500</td>
										<td>20</td>
										<td>3</td>
									</tr>
								</tbody>
							</table>
						</div>
						<p className="docs__text">
							When a rate limit is exceeded, the API returns a{" "}
							<code className="docs__inline-code">429</code>{" "}
							status code with an error message indicating your
							limit.
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
							Extracts structured data from the provided text
							using either a preset or a saved user-defined
							schema.
						</p>

						<h3 className="docs__subsection-title">Request body</h3>
						<pre className="docs__code">{`{
  "mode": "preset" | "user_defined",
  "preset": "expense_note" | "task_list" | "contact_info" | null,
  "schema_id": number | null,
  "text": "Your input text here"
}`}</pre>

						<h3 className="docs__subsection-title">Response</h3>
						<pre className="docs__code">{`{
  "input_text": "Your input text here",
  "mode": "preset" | "user_defined",
  "preset": "expense_note" | "task_list" | "contact_info" | null,
  "result": { ... }
}`}</pre>
					</section>

					{/* PRESETS */}
					<section className="docs__section" id="presets">
						<h2 className="docs__section-title">Presets</h2>
						<p className="docs__text">
							Presets are built-in extraction schemas for common
							use cases. Set{" "}
							<code className="docs__inline-code">mode</code> to{" "}
							<code className="docs__inline-code">"preset"</code>{" "}
							and specify the preset name. No schema ID is needed.
						</p>

						<h3 className="docs__subsection-title">expense_note</h3>
						<p className="docs__text">
							Extracts expense items including type, amount,
							currency, and payment status from financial notes.
						</p>
						<pre className="docs__code">{`// Response
{
  "input_text": "Rent 900 EUR paid. Electricity 110 EUR overdue.",
  "mode": "preset",
  "preset": "expense_note",
  "result": {
    "category": "expense_note",
    "items": [
      { "type": "Rent", "amount": 900.0, "currency": "EUR", "status": "Paid" },
      { "type": "Electricity", "amount": 110.0, "currency": "EUR", "status": "Overdue" }
    ]
  }
}`}</pre>

						<h3 className="docs__subsection-title">task_list</h3>
						<p className="docs__text">
							Extracts tasks, assignees, due dates, and statuses
							from plain text descriptions.
						</p>
						<pre className="docs__code">{`// Response
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

						<h3 className="docs__subsection-title">contact_info</h3>
						<p className="docs__text">
							Extracts contact details including name, email,
							phone number, and company from text.
						</p>
						<pre className="docs__code">{`// Response
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

					{/* USER DEFINED */}
					<section className="docs__section" id="user-defined">
						<h2 className="docs__section-title">
							User Defined Schemas
						</h2>
						<p className="docs__text">
							Define your own extraction schema using the{" "}
							<a href="/" className="docs__link">
								Schema Builder
							</a>{" "}
							and save it to your account. Once saved, use the
							schema's ID in your API requests. You can find your
							schema IDs in the{" "}
							<a href="/dashboard" className="docs__link">
								Dashboard
							</a>
							.
						</p>

						<h3 className="docs__subsection-title">Request</h3>
						<pre className="docs__code">{`{
  "mode": "user_defined",
  "preset": null,
  "schema_id": 42,
  "text": "The Pro Keyboard is available for 79.99 and currently in stock."
}`}</pre>

						<h3 className="docs__subsection-title">Response</h3>
						<pre className="docs__code">{`{
  "input_text": "The Pro Keyboard is available for 79.99 and currently in stock.",
  "mode": "user_defined",
  "preset": null,
  "result": {
    "product_name": "Pro Keyboard",
    "price": 79.99,
    "in_stock": true
  }
}`}</pre>

						<p className="docs__text">
							For best results, use descriptive field names in the
							Schema Builder that clearly indicate what
							information should be extracted.
						</p>
					</section>

					{/* ERRORS */}
					<section className="docs__section" id="errors">
						<h2 className="docs__section-title">Errors</h2>
						<p className="docs__text">
							All errors return a JSON object with an{" "}
							<code className="docs__inline-code">error</code>{" "}
							field describing what went wrong.
						</p>
						<div className="docs__table-wrapper">
							<table className="docs__table">
								<thead>
									<tr>
										<th>Status</th>
										<th>Meaning</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<code className="docs__inline-code">
												400
											</code>
										</td>
										<td>
											Invalid request body — check your
											mode or schema ID
										</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												401
											</code>
										</td>
										<td>Invalid or missing API key</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												404
											</code>
										</td>
										<td>
											Schema ID not found or not owned by
											your account
										</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												429
											</code>
										</td>
										<td>Rate limit exceeded</td>
									</tr>
									<tr>
										<td>
											<code className="docs__inline-code">
												500
											</code>
										</td>
										<td>Unexpected server error</td>
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
