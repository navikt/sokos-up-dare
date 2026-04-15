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
