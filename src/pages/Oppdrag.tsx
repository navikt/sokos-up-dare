import {
	CheckmarkIcon,
	DownloadIcon,
	FileIcon,
	FilesIcon,
	TestFlaskIcon,
} from "@navikt/aksel-icons";
import {
	Alert,
	BodyLong,
	Box,
	Button,
	Heading,
	HStack,
	InlineMessage,
	Loader,
	Modal,
	Switch,
	TextField,
	VStack,
} from "@navikt/ds-react";
import type { DateRange } from "@navikt/ds-react/src/date/Date.typeutils";
import {
	compressToEncodedURIComponent,
	decompressFromEncodedURIComponent,
} from "lz-string";
import { startTransition, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { postOppdrag } from "../api/apiService";
import BeregningsTabell from "../components/BeregningsTabell";
import DatoFelt from "../components/DatoFelt";
import SkattekortForm from "../components/SkattekortForm";
import TrekkListe, { nyttTrekk } from "../components/TrekkForm";
import { oppdragsXmlTemplate } from "../data/oppdragsXmlTemplate";
import type { Beregning } from "../types/Beregning";
import type { FetchState } from "../types/FetchState";
import type { Oppdragsbeskrivelse } from "../types/Oppdragsbeskrivelse";
import type { Skattetrekk } from "../types/Skattetrekk";
import type { Testberegning } from "../types/Testberegning";
import type { Trekk } from "../types/Trekk";
import { formatXmlDate } from "../util/date";
import { useFlaskBubbles } from "../util/misc";
import { fillTemplate, flattenObject } from "../util/template";
import styles from "./TemplatePage.module.css";

const currentYear = new Date().getFullYear();

const initialState: Oppdragsbeskrivelse = {
	vedtaksSats: 800,
	sats: 800,
	skattekort: {
		skattetrekkType: "tabelltrekk",
		prosentSats: "36,9",
		tabellNummer: "8010",
	},
	datoVedtakFom: `${currentYear}-03-31`,
	datoVedtakTom: `${currentYear}-04-11`,
};

export const Oppdrag = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const modalRef = useRef<HTMLDialogElement>(null);
	const [state, setState] = useState<FetchState<Beregning>>({ status: "idle" });
	const [copying, setCopying] = useState<boolean>(false);
	const [modalContent, setModalContent] = useState<string>("");
	const [warn, setWarn] = useState<string>("");
	const [showCapacity, setShowCapacity] = useState<boolean>(false);

	const handleSubmit = () => {
		const oppdragsXml = filledTemplate();
		const testberegning: Testberegning = {
			oppdragsXmlVersjon: "2.5",
			oppdragsXml: oppdragsXml,
			...formData.skattekort,
			trekk: formData.trekk,
		};
		const range: DateRange = {
			from: new Date(formData.datoVedtakFom),
			to: new Date(formData.datoVedtakTom),
		};
		postOppdrag(setState, testberegning, range);
	};

	const [formData, setFormData] = useState<Oppdragsbeskrivelse>(() => {
		const params = new URLSearchParams(location.search);
		const compressedState = params.get("state");

		if (compressedState) {
			const json = decompressFromEncodedURIComponent(compressedState);
			if (json) return JSON.parse(json);
			setWarn("Form resatt pga. ugyldig tilstand.");
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

	const DateWarning = () => {
		if (formData?.datoVedtakFom && formData.datoVedtakTom) {
			const fom = new Date(formData.datoVedtakFom);
			const tom = new Date(formData.datoVedtakTom);
			return (
				<>
					{tom.valueOf() < fom.valueOf() && (
						<InlineMessage status={"error"}>
							"Fra og med" er etter "Til og med"
						</InlineMessage>
					)}
					{(tom.getFullYear() !== currentYear ||
						fom.getFullYear() !== currentYear) && (
						<InlineMessage status={"warning"}>
							Skattetrekk for tidligere år
						</InlineMessage>
					)}
				</>
			);
		}
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

	useFlaskBubbles();

	return (
		<div className={styles["template-body"]}>
			<div className={styles["template-header"]}>
				<Heading spacing level="1" size="large">
					<HStack justify={"center"} align={"center"} gap={"1"}>
						Oppdragstester
						<TestFlaskIcon
							id="testflask"
							title="Oppdragstester"
							fontSize="3rem"
						/>
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
								setFormData({ ...formData, sats: parseInt(e.target.value, 10) })
							}
						></TextField>
						<TextField
							type={"number"}
							label={"Vedtakssats"}
							value={formData.vedtaksSats}
							onChange={(e) =>
								setFormData({
									...formData,
									vedtaksSats: parseInt(e.target.value, 10),
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
							<DateWarning />
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
				<HStack gap="2" className={"knapperad"}>
					<Button
						variant={"secondary"}
						onClick={() => {
							setFormData({
								...formData,
								trekk: [
									...(formData.trekk || []),
									nyttTrekk(formData.datoVedtakFom, formData.datoVedtakTom),
								],
							});
						}}
					>
						Legg til trekk
					</Button>
				</HStack>
				<TrekkListe
					trekk={formData.trekk}
					update={(value: Trekk[]) =>
						setFormData({ ...formData, trekk: value })
					}
				/>
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
							onClick={() => setFormData(initialState)}
						>
							Nullstill
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
						<BeregningsTabell calc={state.data} showCapacity={showCapacity} />
					)}
				</Box>
			</VStack>
		</div>
	);
};
