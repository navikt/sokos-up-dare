import { HStack, TextField } from "@navikt/ds-react";
import type React from "react";
import type { NamedField } from "../util/template";
import DatoFelt from "./DatoFelt";

type Props = {
	fields: NamedField[];
	values: Record<string, string>;
	onChange: (name: string, value: string) => void;
	getLabel: (name: string) => string;
};

const DynamicForm: React.FC<Props> = ({
	fields,
	values,
	onChange,
	getLabel,
}) => {
	return (
		<HStack gap="4" wrap>
			{fields.map((field) => {
				const value = values[field.name] ?? field.value;

				if (field.kind === "dato") {
					return (
						<DatoFelt
							key={field.name}
							label={getLabel(field.name)}
							value={value}
							update={(v) => onChange(field.name, v)}
						/>
					);
				}

				return (
					<TextField
						key={field.name}
						label={getLabel(field.name)}
						type={field.kind === "number" ? "number" : "text"}
						value={value}
						onChange={(e) => onChange(field.name, e.target.value)}
					/>
				);
			})}
		</HStack>
	);
};

export default DynamicForm;
