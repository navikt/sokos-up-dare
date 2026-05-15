import { BodyShort, Heading, HelpText, Table, VStack } from "@navikt/ds-react";
import type React from "react";
import type { ExtraInfo, ExtraInfoValue } from "../types/Beregning";
import { capitalize } from "../util/misc";

function label(key: string) {
	const map: Record<string, string> = {
		prosentSats: "Prosentsats",
		inntektsAar: "Inntektsår",
		utstedtDato: "Utstedt dato",
		skatteDager: "Skattedager",
		periode: "Periode",
	};
	return map[key] || capitalize(key);
}

const KeyValTableRow: React.FC<{
	field: string;
	value: ExtraInfoValue;
}> = ({ field, value }) => {
	return (
		<Table.Row>
			<Table.HeaderCell>{label(field)}:</Table.HeaderCell>
			<Table.DataCell>{value.verdi}</Table.DataCell>
		</Table.Row>
	);
};

const ExtraInfoTable: React.FC<{ info: ExtraInfo }> = ({ info }) => {
	return (
		<VStack gap="space-2">
			<Heading level="2" size="small">
				{label(info.grunn)}
			</Heading>
			<BodyShort>{info.tekst}</BodyShort>
			{info.verdier && (
				<Table size="small">
					<Table.Body>
						{Object.entries(info.verdier).map(([name, value]) => (
							<KeyValTableRow key={name} field={name} value={value} />
						))}
					</Table.Body>
				</Table>
			)}
		</VStack>
	);
};

export const ExtraInfoIcon: React.FC<{ data: ExtraInfo[] }> = ({ data }) => {
	if (data.length === 0) {
		return null;
	}

	return (
		<HelpText title="info">
			<VStack gap="space-6">
				{data.map((info) => (
					<ExtraInfoTable
						key={`${info.type}-${info.grunn}-${info.tekst}`}
						info={info}
					/>
				))}
			</VStack>
		</HelpText>
	);
};
