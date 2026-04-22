import { ChevronLeftDoubleIcon } from "@navikt/aksel-icons";
import React from "react";
import { useNavigate } from "react-router";

export default function Backbutton() {
	const navigate = useNavigate();
	return (
		<div style={{ position: "absolute" }}>
			<ChevronLeftDoubleIcon
				title="Tilbake"
				fontSize="2rem"
				style={{ cursor: "pointer" }}
				onClick={() => navigate(-1)}
			/>
		</div>
	);
}
