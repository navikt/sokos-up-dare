import React from "react";
import { Heading, HelpText, Table, VStack } from "@navikt/ds-react";
import { ExtraInfo, ExtraInfoValueType } from "../types/Beregning";
import {
  ExtraInfoTypes,
  SkatteTrekkTypes,
} from "../types/schema/ExtraInfoSchema";
import { capitalize } from "../util/misc";

function label(key: string) {
  const map: Record<string, string> = {
    [ExtraInfoTypes.ProsentExtraInfo]: "Prosenttrekk",
    [ExtraInfoTypes.TabellExtraInfo]: "Tabelltrekk",
    [ExtraInfoTypes.OverstyrtSkatteKort]: "Overstyrt skattekort",
    [SkatteTrekkTypes.ProsentSkatteTrekk]: "Skattetrekk (prosent)",
    [SkatteTrekkTypes.TabellSkatteTrekk]: "Skattetrekk (tabell)",
    [SkatteTrekkTypes.DefaultSkatteTrekk]: "Skattetrekk (default)",
    prosentSats: "Prosentsats",
    inntektsAar: "Inntektsår",
    utstedtDato: "Utstedt dato",
    skatteDager: "Skattedager",
  };
  return map[key] || capitalize(key);
}

function formatValue(value: ExtraInfoValueType): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === "boolean") {
    return value ? "Ja" : "Nei";
  }
  return String(value);
}

const KeyValTableRow: React.FC<{
  tab: number;
  field: string;
  value: ExtraInfoValueType | object;
}> = ({ tab, field, value }) => {
  if (typeof value === "object" && !Array.isArray(value)) {
    const { type, ...data } = value as { type: string } & Record<
      string,
      ExtraInfoValueType | object
    >;
    return (
      <>
        <Table.Row key={`${type || field}-${field}`}>
          <Table.HeaderCell>
            {tab > 0 && <span style={{ paddingLeft: `${tab * 2}rem` }}></span>}
            <span style={{ textDecoration: "underline" }}>
              {label(type || field)}:
            </span>
          </Table.HeaderCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
        {Object.entries(data).map(([k, v]) => (
          <KeyValTableRow tab={tab + 1} key={k} field={k} value={v} />
        ))}
      </>
    );
  }
  return (
    <Table.Row key={field}>
      <Table.HeaderCell>
        {tab > 0 && <span style={{ paddingLeft: `${tab * 2}rem` }}></span>}
        {label(field)}:
      </Table.HeaderCell>
      <Table.DataCell>{formatValue(value)}</Table.DataCell>
    </Table.Row>
  );
};

const ExtraInfoTable: React.FC<
  ({ type?: string } & Record<string, ExtraInfoValueType>) | ExtraInfo
> = ({ type, ...data }) => {
  return (
    <>
      {type && (
        <Heading
          level="2"
          size="small"
          spacing
          style={{ textDecoration: "underline" }}
        >
          {label(type)}:
        </Heading>
      )}
      <Table size={"small"}>
        {Object.entries(data).map(([key, value]) => (
          <KeyValTableRow tab={0} key={key} field={key} value={value} />
        ))}
      </Table>
    </>
  );
};

export const ExtraInfoIcon: React.FC<{ data: ExtraInfo[] }> = ({ data }) => {
  return (
    data.length > 0 && (
      <HelpText title={"info"}>
        <VStack>
          {data.map((info, index) => (
            <ExtraInfoTable key={"extrainfo-" + index} {...info} />
          ))}
        </VStack>
      </HelpText>
    )
  );
};
