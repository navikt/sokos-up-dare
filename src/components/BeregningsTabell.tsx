import React from "react";
import { Box, Table, Tooltip } from "@navikt/ds-react";
import { Beregning, Row } from "../types/Beregning";

const BeregningsTabell: React.FC<{ calc: Beregning }> = ({ calc }) => {
  return (
    calc && (
      <Box padding={{ xs: "2", md: "6" }}>
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
      </Box>
    )
  );
};

export default BeregningsTabell;
