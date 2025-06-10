import React, { startTransition, useState } from "react";
import {
  Accordion,
  Alert,
  BodyLong,
  Box,
  Button,
  DatePicker,
  HStack,
  Heading,
  Loader,
  Table,
  Textarea,
  Tooltip,
  VStack,
  useRangeDatepicker,
} from "@navikt/ds-react";
import { getCalculation } from "../api/apiService";
import { Beregning, Row } from "../types/Beregning";
import { FetchState } from "../types/FetchState";
import styles from "./TemplatePage.module.css";
import { exampleXml } from "./exampleXml";

export default function Beregne() {
  const [textAreaData, setTextArea] = useState<string>(exampleXml);
  const [xmlData, setXmlData] = useState<string>("");
  const [state, setState] = useState<FetchState<Beregning>>({ status: "idle" });
  const { datepickerProps, toInputProps, fromInputProps, selectedRange } =
    useRangeDatepicker({
      defaultSelected: {
        from: new Date("2025-03-31"),
        to: new Date("2025-04-11"),
      },
    });

  const handleSubmit = async () => {
    setState({ status: "loading" });
    try {
      const result = await getCalculation(xmlData, selectedRange);
      setState({ status: "success", data: result });
    } catch (err) {
      setState({ status: "error", error: (err as Error).message });
    }
  };

  return (
    <>
      <div className={styles["template-body"]}>
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
                </VStack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>

          <Box padding="2">
            <HStack gap={"4"}>
              <VStack padding={"1"}>
                <Heading size={"small"}>Beregningsperiode:</Heading>
                <DatePicker {...datepickerProps}>
                  <HStack wrap gap="4" justify="center">
                    <DatePicker.Input
                      {...fromInputProps}
                      label="Fra"
                      size="small"
                    />
                    <DatePicker.Input
                      {...toInputProps}
                      label="Til"
                      size="small"
                    />
                  </HStack>
                </DatePicker>
              </VStack>
              <VStack justify={"end"}>
                <Button
                  variant="primary"
                  onClick={() => {
                    startTransition(() => {
                      setXmlData(textAreaData);
                      handleSubmit();
                    });
                  }}
                >
                  Send oppdrag
                </Button>
              </VStack>
            </HStack>
          </Box>
        </Box>
        {state.status === "loading" && (
          <div className={styles.loader}>
            <Loader size="3xlarge" title="Henter data..." />
          </div>
        )}
        {state.status === "error" && (
          <Alert variant={"error"}> Noe gikk galt: {state.error} </Alert>
        )}
        {state.status === "success" && <BeregningsTabell calc={state.data} />}
      </div>
    </>
  );
}

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
