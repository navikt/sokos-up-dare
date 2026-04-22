import {
	CheckmarkIcon,
	DownloadIcon,
	FileIcon,
	FilesIcon,
	WrenchIcon,
} from "@navikt/aksel-icons";
import {
	Accordion,
	Alert,
	BodyLong,
	Box,
	Button,
	Heading,
	HelpText,
	HStack,
	Loader,
	Modal,
	Switch,
	Textarea,
	VStack,
} from "@navikt/ds-react";
import { decompressFromEncodedURIComponent } from "lz-string";
import React, { startTransition, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { postOppdragXML } from "../api/apiService";
import Backbutton from "../components/Backbutton";
import BeregningsTabell from "../components/BeregningsTabell";
import DynamicForm from "../components/DynamicForm";
import { oppdragsXmlTypedTemplate } from "../data/oppdragsXmlTypedTemplate";
import type { Beregning } from "../types/Beregning";
import type { FetchState } from "../types/FetchState";
import { fillTypedTemplate, templateFields } from "../util/template";
import { useCompressedQueryStateSync } from "../util/useCompressedQueryStateSync";
import styles from "./TemplatePage.module.css";

const initialState: Record<string, string> = {
	textAreaData: oppdragsXmlTypedTemplate,
};

const labels: Record<string, string> = {
	datoVedtakFom: "Fra dato",
	datoVedtakTom: "Til dato",
	sats: "Sats",
	oppdragGjelderId: "Gjelder",
	utbetalesTilId: "Utbetales til",
	vedtakssats: "Vedtakssats",
};

export const OppdragsBygger = () => {
	const location = useLocation();
	const modalRef = useRef<HTMLDialogElement>(null);
	const [state, setState] = useState<FetchState<Beregning>>({ status: "idle" });
	const [copying, setCopying] = useState<boolean>(false);
	const [modalContent, setModalContent] = useState<string>("");
	const [showCapacity, setShowCapacity] = useState<boolean>(false);
	const [warn, setWarn] = useState<string>("");

	const [formData, setFormData] = useState<Record<string, string>>(() => {
		const params = new URLSearchParams(location.search);
		const compressedState = params.get("state");

		if (compressedState) {
			const json = decompressFromEncodedURIComponent(compressedState);
			if (json) return JSON.parse(json);
			setWarn("Form resatt pga. ugyldig tilstand.");
		}
		return initialState;
	});

	const namedFields = useMemo(
		() => templateFields(formData.textAreaData),
		[formData?.textAreaData],
	);

	const handleSubmit = () => {
		const oppdragsXml = filledTemplate();
		postOppdragXML(setState, oppdragsXml);
	};

	const filledTemplate = (): string => {
		return fillTypedTemplate(formData.textAreaData, namedFields, formData);
	};

	useCompressedQueryStateSync(formData, { key: "state", debounceMs: 300 });

	return (
		<div className={styles["template-body"]}>
			<Backbutton />
			<div className={styles["template-header"]}>
				<Heading spacing level="1" size="large">
					<HStack justify={"center"} align={"center"} gap={"1"}>
						Oppdragsbygger
						<WrenchIcon
							id="wrenchIcon"
							title="Oppdragsbygger"
							fontSize="3rem"
						/>
						<About />
					</HStack>
				</Heading>
				{warn && (
					<Alert
						variant="warning"
						closeButton={true}
						onClose={() => setWarn("")}
					>
						{warn}
					</Alert>
				)}
			</div>
			<Accordion>
				<Accordion.Item>
					<Accordion.Header>Oppdrag</Accordion.Header>
					<Accordion.Content>
						<VStack>
							<Box padding="6">
								<Textarea
									label="XML"
									resize
									value={formData.textAreaData}
									onChange={(e) => {
										setFormData((prev) => ({
											...prev,
											textAreaData: e.target.value,
										}));
									}}
								/>
							</Box>
						</VStack>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>

			<h3>From:</h3>
			<DynamicForm
				fields={namedFields}
				values={formData}
				onChange={(name, value) =>
					setFormData((prev) => ({ ...prev, [name]: value }))
				}
				getLabel={(name) => labels[name] ?? name}
			/>

			<VStack gap="2"></VStack>
			<VStack gap={"4"}>
				<Box />
				<HStack justify={"space-between"}>
					<HStack gap="2" className={"knapperad"}>
						<Button
							variant="primary"
							disabled={state.status === "loading"}
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
							disabled={state.status === "loading"}
							onClick={() =>
								setFormData({ textAreaData: formData.textAreaData })
							}
						>
							Nullstill felter
						</Button>
						<Button
							variant="secondary"
							disabled={state.status === "loading"}
							onClick={() => setFormData(initialState)}
						>
							Nullstill templat
						</Button>
					</HStack>
					<HStack gap={"2"}>
						<Switch
							checked={showCapacity}
							position={"left"}
							onChange={() => setShowCapacity(!showCapacity)}
						>
							Vis detaljert kapasitet
						</Switch>
						<Button
							variant="secondary-neutral"
							disabled={state.status === "loading"}
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
							iconPosition={"right"}
							icon={
								copying ? (
									<CheckmarkIcon className={"bump"} aria-hidden />
								) : (
									<FilesIcon aria-hidden />
								)
							}
						>
							Kopiér
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
							<code style={{ fontSize: "small" }}>{modalContent}</code>
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
						<BeregningsTabell
							beregning={state.data}
							showCapacity={showCapacity}
						/>
					)}
				</Box>
			</VStack>
		</div>
	);
};

function About() {
	return (
		<HelpText title="Hva er dette?">
			<div style={{ textAlign: "left" }}>
				<h3>Hva er dette?</h3>
				Under Oppdrag skjuler det seg en XML template.
				<br />
				<code>
					&lt;Element&gt;verdi{"{"}type{"}"}&lt;/Element&gt;
				</code>{" "}
				blir til et editeringsfelt under med "verdi" som standardverdi og {"{"}
				type{"}"} som type.
				<br />
				<br />
				Det finnes kun to typer {"{"}dato{"}"} som blir til et datofelt, alt
				annet blir til tekstfelt. Når du trykker på send oppdrag blir verdiene i
				feltene lagt inn i templaten før den sendes til serveren. Du kan
				forhåndsvise dette ved å trykke på vis XML eller med nedlastingsknappen.
			</div>
		</HelpText>
	);
}
