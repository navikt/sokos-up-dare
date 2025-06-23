import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import React, { startTransition, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  CheckmarkIcon,
  DownloadIcon,
  FileIcon,
  FilesIcon,
} from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  Box,
  Button,
  HStack,
  Heading,
  Loader,
  Modal,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { DateRange } from "@navikt/ds-react/src/date/Date.typeutils";
import { testCalculation } from "../api/apiService";
import BeregningsTabell from "../components/BeregningsTabell";
import DatoFelt from "../components/DatoFelt";
import SkattekortForm from "../components/SkattekortForm";
import { oppdragsXmlTemplate } from "../data/oppdragsXmlTemplate";
import { Beregning } from "../types/Beregning";
import { FetchState } from "../types/FetchState";
import { Oppdragsbeskrivelse } from "../types/Oppdragsbeskrivelse";
import { Skattetrekk } from "../types/Skattetrekk";
import { Testberegning } from "../types/Testberegning";
import { formatXmlDate } from "../util/date";
import { fillTemplate, flattenObject } from "../util/template";
import styles from "./TemplatePage.module.css";

const initialState: Oppdragsbeskrivelse = {
  vedtaksSats: 800,
  sats: 800,
  skattekort: {
    skattetrekkType: "tabelltrekk",
    prosentSats: "36,9",
    tabellNummer: "8010",
  },
  datoVedtakFom: "2025-03-27",
  datoVedtakTom: "2025-04-11",
};

export const Oppdrag = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<FetchState<Beregning>>({ status: "idle" });
  const [copying, setCopying] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");

  const handleSubmit = async () => {
    setState({ status: "loading" });
    try {
      const oppdragsXml = filledTemplate();
      const testberegning: Testberegning = {
        oppdragsXmlVersjon: "2.5",
        oppdragsXml: oppdragsXml,
        ...formData.skattekort,
      };
      const range: DateRange = {
        from: new Date(formData.datoVedtakFom),
        to: new Date(formData.datoVedtakTom),
      };
      const result = await testCalculation(testberegning, range);
      setState({ status: "success", data: result });
    } catch (err) {
      setState({ status: "error", error: (err as Error).message });
    }
  };

  const [formData, setFormData] = useState<Oppdragsbeskrivelse>(() => {
    const params = new URLSearchParams(location.search);
    const compressedState = params.get("state");

    if (compressedState) {
      try {
        const json = decompressFromEncodedURIComponent(compressedState);
        return JSON.parse(json);
      } catch {
        // Never mind.
      }
    }
    return initialState;
  });

  const filledTemplate = (): string => {
    const templateParams = {
      ...flattenObject(formData),
      datoVedtakFom: formatXmlDate(formData.datoVedtakFom),
      datoVedtakTom: formatXmlDate(formData.datoVedtakTom),
    };
    return fillTemplate(oppdragsXmlTemplate, templateParams);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const json = JSON.stringify(formData);
        const compressed = compressToEncodedURIComponent(json);
        const params = new URLSearchParams(location.search);
        params.set("state", compressed);
        navigate({ search: params.toString() }, { replace: true });
      } catch {
        // Never mind
      }
    }, 300); // debounce delay

    return () => clearTimeout(timeout);
  }, [formData, navigate, location.search]);

  return (
    <>
      <div className={styles["template-body"]}>
        <div className={styles["template-header"]}>
          <Heading spacing level="1" size="large">
            Oppdragstester.
          </Heading>
        </div>
        <VStack gap="2">
          <HStack gap="2">
            <Box
              as="header"
              padding="2"
              borderWidth="1"
              borderColor={"border-alt-3"}
              borderRadius={{ md: "large" }}
            >
              <Heading level={"2"} size={"small"}>
                Skattetrekk
              </Heading>
              <SkattekortForm
                skattekort={formData.skattekort}
                update={(skattekort: Skattetrekk) =>
                  setFormData({
                    ...formData,
                    skattekort: skattekort,
                  })
                }
              />
            </Box>
            <Box
              as="header"
              padding="2"
              borderWidth="1"
              borderColor={"border-alt-3"}
              borderRadius={{ md: "large" }}
            >
              <TextField
                type={"number"}
                label={"Sats"}
                value={formData.sats}
                onChange={(e) =>
                  setFormData({ ...formData, sats: parseInt(e.target.value) })
                }
              ></TextField>
              <TextField
                type={"number"}
                label={"Vedtakssats"}
                value={formData.vedtaksSats}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vedtaksSats: parseInt(e.target.value),
                  })
                }
              ></TextField>
            </Box>
            <Box
              as="header"
              padding="2"
              borderWidth="1"
              borderColor={"border-alt-3"}
              borderRadius={{ md: "large" }}
            >
              <Heading level={"2"} size={"small"}>
                Dato
              </Heading>
              <DatoFelt
                label={"Fra og med"}
                value={formData.datoVedtakFom}
                update={(value: string) =>
                  setFormData({ ...formData, datoVedtakFom: value })
                }
              />
              <DatoFelt
                label={"Til og med"}
                value={formData.datoVedtakTom}
                update={(value: string) =>
                  setFormData({ ...formData, datoVedtakTom: value })
                }
              />
            </Box>
          </HStack>
        </VStack>
        <VStack gap={"4"}>
          <Box />
          <HStack justify={"space-between"}>
            <HStack gap="2">
              <Button
                variant="primary"
                disabled={state.status == "loading"}
                onClick={() => {
                  startTransition(() => {
                    handleSubmit();
                  });
                }}
              >
                Send oppdrag
              </Button>
              <Button
                variant="secondary"
                disabled={state.status == "loading"}
                onClick={() => setFormData(initialState)}
              >
                Nullstill
              </Button>
            </HStack>
            <HStack gap={"2"}>
              <Button
                variant="secondary-neutral"
                disabled={state.status == "loading"}
                onClick={() => {
                  setModalContent(filledTemplate());
                  modalRef.current?.showModal();
                }}
              >
                Vis XML
              </Button>
              <Button
                variant={"secondary-neutral"}
                onClick={() => {
                  const xml = filledTemplate();
                  const blob = new Blob([xml], { type: "application/xml" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "oppdrag.xml";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <DownloadIcon title="Last ned" fontSize="1.5rem" />
              </Button>
              <Button
                variant={"secondary-neutral"}
                onClick={() => {
                  const xml = filledTemplate();
                  navigator.clipboard.writeText(xml);
                  setCopying(true);
                  setTimeout(() => setCopying(false), 400);
                }}
              >
                {copying ? (
                  <CheckmarkIcon className={"bump"} fontSize="1.5rem" />
                ) : (
                  <FilesIcon title="Kopiér" fontSize="1.5rem" />
                )}
              </Button>
            </HStack>
          </HStack>

          <Modal
            ref={modalRef}
            header={{
              label: "XML",
              icon: <FileIcon aria-hidden />,
              heading: "Oppdrags-xml",
            }}
          >
            <Modal.Body>
              <BodyLong>
                <pre style={{ fontSize: "small" }}>{modalContent}</pre>
              </BodyLong>
            </Modal.Body>
          </Modal>

          <Box>
            {state.status === "loading" && (
              <div className={styles.loader}>
                <Loader size="3xlarge" title="Henter data..." />
              </div>
            )}
            {state.status === "error" && (
              <Alert variant={"error"}> Noe gikk galt: {state.error} </Alert>
            )}
            {state.status === "success" && (
              <BeregningsTabell calc={state.data} />
            )}
          </Box>
        </VStack>
      </div>
    </>
  );
};
