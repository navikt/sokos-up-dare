import { Alert, Heading, Loader } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { findBeregning } from "../api/apiService";
import Backbutton from "../components/Backbutton";
import BeregningsTabell from "../components/BeregningsTabell";
import type { Beregning } from "../types/Beregning";
import type { FetchState } from "../types/FetchState";
import styles from "./TemplatePage.module.css";

export default function Beregningsdetailjer() {
	const { id } = useParams<{ id: string }>();
	const [state, setState] = useState<FetchState<Beregning>>({
		status: "idle",
	});

	useEffect(() => {
		if (id) {
			findBeregning(setState, Number(id));
		}
	}, [id]);

	return (
		<div className={styles["template-body"]}>
			<Backbutton />
			<div className={styles["template-header"]}>
				<Heading spacing level="1" size="large">
					Beregning
				</Heading>
			</div>
			{state.status === "loading" && (
				<div className={styles.loader}>
					<Loader size="3xlarge" title="Henter data..." />
				</div>
			)}
			{state.status === "error" && (
				<Alert variant={"error"}> Noe gikk galt: {state.error} </Alert>
			)}
			{state.status === "success" && (
				<BeregningsTabell beregning={state.data} />
			)}
		</div>
	);
}
