import {
  Accordion,
  BodyLong,
  Box,
  Heading,
  Loader,
  Table,
} from "@navikt/ds-react";
import { useGetCalculation } from "../api/apiService";
import { Row } from "../types/Beregning";
import styles from "./TemplatePage.module.css";

export default function TemplatePage() {
  // Marker ut denne for at kallet går mot Mock Service Worker

  const { data: calc, isLoading } = useGetCalculation();

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader size="3xlarge" title="Henter data..." />
      </div>
    );
  }

  return (
    <>
      <div className={styles["template-body"]}>
        <Heading spacing level="2" size="medium">
          Beregning
        </Heading>

        <div className={styles["template-header"]}>
          <Heading spacing level="1" size="large">
            Dare POC - Mikrofrontend
          </Heading>
          <BodyLong>Utkast for beregningsgrunnlag for AAP</BodyLong>
        </div>

        <Box
          padding="6"
          borderRadius="xlarge"
          borderColor="border-subtle"
          borderWidth="1"
        >
          <Accordion>
            <Accordion.Item>
              <Accordion.Header>XML</Accordion.Header>
              <Accordion.Content>
                Her er det foreløpig ingenting
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Box>

        {calc && (
          <Box padding={{ xs: "2", md: "6" }}>
            <Table key={"Beregning"}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col">Dag</Table.HeaderCell>
                  {calc.columnNames.map((col) => (
                    <Table.DataCell key={col} scope="col">
                      {col}
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
                    <Table.HeaderCell scope="row">
                      {row.rowName}
                    </Table.HeaderCell>
                    {row.singleVal ? (
                      <Table.DataCell
                        align={"right"}
                        colSpan={calc.columnNames.length}
                      >
                        {row.values[0]}
                      </Table.DataCell>
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
        )}
      </div>
    </>
  );
}
