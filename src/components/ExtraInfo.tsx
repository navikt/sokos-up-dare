import React from "react";
import { Heading, HelpText, Table, VStack } from "@navikt/ds-react";
import {
  ExtraInfo,
  OverstyrtSkatteKortExtraInfo,
  ProsentExtraInfo,
  TabellExtraInfo,
} from "../types/Beregning";
import { ExtraInfoTypes } from "../types/schema/ExtraInfoSchema";

const KeyValTable: React.FC<{
  data: Record<string, string | number>;
  title?: string;
}> = ({ data, title }) => {
  return (
    <>
      {title && (
        <Heading
          level="2"
          size="small"
          spacing
          style={{ textDecoration: "underline" }}
        >
          {title}:
        </Heading>
      )}
      <Table size={"small"}>
        {Object.entries(data).map(([key, value]) => (
          <Table.Row key={key}>
            <Table.HeaderCell>{key}:</Table.HeaderCell>
            <Table.DataCell>{value}</Table.DataCell>
          </Table.Row>
        ))}
      </Table>
    </>
  );
};

export const ProsentTrekk: React.FC<{ info: ProsentExtraInfo }> = ({
  info,
}) => (
  <KeyValTable
    title="Prosenttrekk"
    data={{
      Skattegrunnlag: info.grunnlag,
      Prosentsats: info.skatteInfo.prosentSats,
    }}
  />
);

export const OverstyrtSkatteKort: React.FC<{
  info: OverstyrtSkatteKortExtraInfo;
}> = ({ info }) => (
  <KeyValTable
    title={"Overstyrt skattekort"}
    data={{
      Skattegrunnlag: info.grunnlag,
      Prosentsats: info.prosentSats,
      "Grunn for overstyring": info.grunn,
    }}
  />
);

export const TabellTrekk: React.FC<{ info: TabellExtraInfo }> = ({ info }) => {
  // noinspection JSNonASCIINames
  return (
    <KeyValTable
      title={"Tabelltrekk"}
      data={{
        Skattegrunnlag: info.grunnlag,
        Tabelltrekk: info.skatteInfo.trekktabell,
        Inntektsår: info.skatteInfo.inntektsAar,
        "Skattekort ID": info.skatteInfo.skattekortIdentifikator,
        "Utstedt dato": info.skatteInfo.utstedtDato,
        Skattedager: info.skatteDager,
      }}
    />
  );
};

export const ExtraInfoContent: React.FC<{ info: ExtraInfo }> = ({ info }) => {
  switch (info.type) {
    case ExtraInfoTypes.OverstyrtSkatteKort:
      return (
        <OverstyrtSkatteKort info={info as OverstyrtSkatteKortExtraInfo} />
      );
    case ExtraInfoTypes.ProsentExtraInfo:
      return <ProsentTrekk info={info as ProsentExtraInfo} />;
    case ExtraInfoTypes.TabellExtraInfo:
      return <TabellTrekk info={info as TabellExtraInfo} />;
  }
};

export const ExtraInfoIcon: React.FC<{ data: ExtraInfo[] }> = ({ data }) => {
  return (
    data.length > 0 && (
      <HelpText title={"info"}>
        <VStack>
          {data.map((info, index) => (
            <ExtraInfoContent key={"extrainfo-" + index} info={info} />
          ))}
        </VStack>
      </HelpText>
    )
  );
};
