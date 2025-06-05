import React, { startTransition, useState } from "react";
import {
  Accordion,
  BodyLong,
  Box,
  Button,
  HStack,
  Heading,
  Loader,
  Table,
  Textarea,
  Tooltip,
  VStack,
} from "@navikt/ds-react";
import { useGetCalculation } from "../api/apiService";
import { Row } from "../types/Beregning";
import styles from "./TemplatePage.module.css";
import { exampleXml } from "./exampleXml";

export default function TemplatePage() {
  const [textAreaData, setTextArea] = useState<string>(exampleXml);
  const [xmlData, setXmlData] = useState<string>(exampleXml);

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
              <Accordion.Header>Oppdrag</Accordion.Header>
              <Accordion.Content>
                <VStack>
                  <Box padding="6">
                    <Textarea
                      label="XML"
                      resize
                      value={textAreaData}
                      onChange={(e) => setTextArea(e.target.value)}
                    />
                  </Box>
                  <HStack gap={"4"}>
                    <Button
                      variant="primary"
                      disabled={textAreaData === xmlData}
                      onClick={() => {
                        startTransition(() => {
                          setXmlData(textAreaData);
                        });
                      }}
                    >
                      Post
                    </Button>
                  </HStack>
                </VStack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Box>
        <Beregning xml={xmlData} />
      </div>
    </>
  );
}

const Beregning: React.FC<{ xml: string }> = ({ xml }) => {
  const { data: calc, isLoading } = useGetCalculation(xml);

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader size="3xlarge" title="Henter data..." />
      </div>
    );
  }

  return (
    calc && (
      <Box padding={{ xs: "2", md: "6" }}>
        <Table id="beregningstabell" key={xml} className={"fade-in"}>
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
                  <Table.DataCell align={"right"} colSpan={calc.columns.length}>
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
    )
  );
};
