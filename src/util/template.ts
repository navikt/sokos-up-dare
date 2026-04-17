import { formatXmlDate } from "./date";

export function fillTemplate(
	template: string,
	values: Record<string, string>,
): string {
	return template.replace(/{(\w+)}/g, (_, key) => values[key] ?? `{${key}}`);
}

export function flattenObject(obj: object): Record<string, string> {
	return Object.fromEntries(
		Object.entries(obj)
			.filter(
				([, value]) => typeof value === "string" || typeof value === "number",
			)
			.map(([key, value]) => [key, String(value)]),
	);
}

export function templateFields(xml: string): NamedField[] {
	const lines = xml.split("\n");
	return lines
		.map((line) => templateField(line))
		.filter((f): f is NamedField => f !== null);
}

function templateField(s: string): NamedField | null {
	const match = s.match(/<([\w-]+)>(.*?)\{(\w+)}<\/[\w-]+>/);
	if (!match) return null;
	return {
		name: match[1],
		value: match[2],
		kind: match[3],
	};
}

export function fillTypedTemplate(
	template: string,
	fields: NamedField[],
	values: Record<string, string>,
): string {
	let result = template;

	for (const field of fields) {
		const pattern = new RegExp(
			`(<${field.name}>)(.*?)\\{${field.kind}\\}(<\\/${field.name}>)`,
		);
		const val =
			(field.kind === "dato"
				? formatXmlDate(values[field.name] || field.value)
				: values[field.name]) || field.value;

		result = result.replace(pattern, `$1${val}$3`);
	}
	return result;
}

export type NamedField = {
	name: string;
	kind: string;
	value: string;
};
