import React from "react";
import { DownloadIcon } from "@navikt/aksel-icons";
import { Box, Button, HStack, Table, Tooltip, VStack } from "@navikt/ds-react";
import { Beregning, Row } from "../types/Beregning";
import { generateCsv } from "../util/misc";
import { ExtraInfoIcon } from "./ExtraInfo";

const BeregningsTabell: React.FC<{ calc: Beregning }> = ({ calc }) => {
  return (
    calc && (
      <Box padding={{ xs: "2", md: "6" }}>
        <VStack gap={"4"}>
          <Table
            id="beregningstabell"
            key={JSON.stringify(calc)}
            className={"fade-in"}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Dag</Table.HeaderCell>
                {calc.columns.map((date) => (
                  <Table.DataCell key={date} scope="col">
                    <Tooltip content={`dato: ${date}`}>
                      <span>
                        {new Date(date).toLocaleDateString("no-NO", {
                          weekday: "long",
                        })}
                      </span>
                    </Tooltip>
                  </Table.DataCell>
                ))}
                <Table.DataCell align={"right"} scope="col">
                  Sum
                </Table.DataCell>
                <Table.DataCell></Table.DataCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {calc.rows.map((row: Row, index: number) => (
                <Table.Row key={row.rowName}>
                  <Table.HeaderCell scope="row">{row.rowName}</Table.HeaderCell>
                  {row.singleVal ? (
                    <Table.DataCell
                      align={"right"}
                      colSpan={calc.columns.length}
                    ></Table.DataCell>
                  ) : (
                    row.values.map((n: number, i: number) => (
                      <Table.DataCell align={"right"} key={`row${i}`}>
                        {n}
                      </Table.DataCell>
                    ))
                  )}
                  <Table.DataCell align={"right"}>
                    {calc.sumColumn[index]}
                  </Table.DataCell>
                  <Table.DataCell>
                    {row.ekstra && <ExtraInfoIcon data={row.ekstra} />}
                  </Table.DataCell>
                </Table.Row>
              ))}
              <Table.Row key={"Kapasitet"}>
                <Table.HeaderCell scope="row">Kapasitet</Table.HeaderCell>
                {calc.sums.values.map((n: number, i: number) => (
                  <Table.DataCell align={"right"} key={`sumrow${i}`}>
                    {n}
                  </Table.DataCell>
                ))}
                <Table.DataCell align={"right"}>
                  {calc.sumColumn.reduce((a, b) => a + b, 0)}
                </Table.DataCell>
              </Table.Row>
            </Table.Body>
          </Table>

          <HStack justify={"end"} gap={"2"}>
            <Button
              variant={"secondary-neutral"}
              onClick={() => {
                const csvString = generateCsv(calc);
                const blob = new Blob([csvString], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "beregning.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              iconPosition={"left"}
              icon={<DownloadIcon aria-hidden />}
            >
              CSV Export
            </Button>
          </HStack>
        </VStack>
      </Box>
    )
  );
};

export default BeregningsTabell;
