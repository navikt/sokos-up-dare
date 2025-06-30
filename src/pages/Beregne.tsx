import React, { startTransition, useState } from "react";
import { TestFlaskIcon } from "@navikt/aksel-icons";
import {
  Accordion,
  Alert,
  BodyLong,
  Box,
  Button,
  DatePicker,
  HStack,
  Heading,
  Link,
  Loader,
  Textarea,
  VStack,
  useRangeDatepicker,
} from "@navikt/ds-react";
import { getCalculation } from "../api/apiService";
import BeregningsTabell from "../components/BeregningsTabell";
import { exampleXml } from "../data/exampleXml";
import { Beregning } from "../types/Beregning";
import { FetchState } from "../types/FetchState";
import { BeregningSchema } from "../types/schema/BeregningSchema";
import styles from "./TemplatePage.module.css";

export default function Beregne() {
  const [textAreaData, setTextArea] = useState<string>(exampleXml);
  const [state, setState] = useState<FetchState<Beregning>>({ status: "idle" });
  const { datepickerProps, toInputProps, fromInputProps, selectedRange } =
    useRangeDatepicker({
      defaultSelected: {
        from: new Date("2025-03-31"),
        to: new Date("2025-04-11"),
      },
    });

  const handleSubmit = async (xmlData: string) => {
    setState({ status: "loading" });
    try {
      const result = await getCalculation(xmlData, selectedRange);
      const response = BeregningSchema.safeParse(result);
      if (!response.success) {
        console.log("Error parsing ", response.error); // eslint-disable-line no-console
        setState({ status: "error", error: "Feil i resultat" });
      } else {
        const beregning = BeregningSchema.parse(response.data);
        setState({ status: "success", data: beregning });
      }
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
                  disabled={state.status == "loading"}
                  onClick={() => {
                    startTransition(() => {
                      handleSubmit(textAreaData);
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

        <Box>
          Prøv også:{" "}
          <Link href="/dare/form" className={"dare-link"}>
            Oppdragstester
            <TestFlaskIcon style={{ color: "black" }} title="Oppdragstester" />
          </Link>{" "}
        </Box>
      </div>
    </>
  );
}
