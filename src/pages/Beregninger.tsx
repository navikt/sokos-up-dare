import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import { Alert, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { decompressFromEncodedURIComponent } from "lz-string";
import React, { startTransition, useState } from "react";
import { useLocation } from "react-router";
import { findBeregninger } from "../api/apiService";
import Backbutton from "../components/Backbutton";
import { BeregningsTabellListe } from "../components/BeregningsTabell";
import DatoFelt from "../components/DatoFelt";
import type { Beregning } from "../types/Beregning";
import type { FetchState } from "../types/FetchState";
import formatDate from "../util/date";
import { useCompressedQueryStateSync } from "../util/useCompressedQueryStateSync";
import styles from "./TemplatePage.module.css";

const now = new Date();
const beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const initialState = (): Record<string, string> => ({
	datoFom: formatDate(beginningOfMonth) || "2026-05-01",
	datoTom: formatDate(endOfMonth) || "2026-05-30",
	formVersion: crypto.randomUUID(),
});

export default function Beregninger() {
	const location = useLocation();
	const [state, setState] = useState<FetchState<Beregning[]>>({
		status: "idle",
	});

	const [warn, setWarn] = useState<string>("");
	const [formData, setFormData] = useState<Record<string, string>>(() => {
		const params = new URLSearchParams(location.search);
		const compressedState = params.get("state");

		if (compressedState) {
			const json = decompressFromEncodedURIComponent(compressedState);
			if (json) return JSON.parse(json);
			setWarn("Form resatt pga. ugyldig tilstand.");
		}
		return initialState();
	});

	const update = (updatedState: Record<string, string>) => {
		setFormData({ ...formData, ...updatedState });
	};

	const handleSubmit = () => {
		findBeregninger(setState, formData.datoFom, formData.datoTom);
	};

	useCompressedQueryStateSync(formData, { key: "state", debounceMs: 300 });

	return (
		<div className={styles["template-body"]}>
			<Backbutton />
			<div className={styles["template-header"]}>
				<Heading spacing level="1" size="large">
					Beregninger
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
			<HStack gap="space-16">
				<DatoFelt
					key={`datofom:${formData.formVersion}`}
					label={"Fra og med"}
					value={formData.datoFom}
					update={(e) => {
						update({ datoFom: e });
					}}
				/>
				<DatoFelt
					key={`datotom:${formData.formVersion}`}
					label={"Til og med"}
					value={formData.datoTom}
					update={(e) => {
						update({ datoTom: e });
					}}
				/>
				<VStack justify={"end"}>
					<HStack gap="space-16">
						<Button
							variant="secondary"
							disabled={state.status === "loading"}
							onClick={() => setFormData(initialState())}
						>
							Nullstill
						</Button>
						<Button
							variant="primary"
							disabled={state.status === "loading"}
							icon={
								<MagnifyingGlassIcon title="a11y-title" fontSize="1.5rem" />
							}
							onClick={() => {
								startTransition(() => {
									handleSubmit();
								});
							}}
						></Button>
					</HStack>
				</VStack>
				{state.status === "success" && (
					<BeregningsTabellListe beregninger={state.data} />
				)}
			</HStack>
		</div>
	);
}
