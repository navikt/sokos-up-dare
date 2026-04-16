import { SackKronerIcon, TestFlaskIcon, WrenchIcon } from "@navikt/aksel-icons";
import { Heading } from "@navikt/ds-react";
import { MenyItem } from "../components/menyItem";
import styles from "./TemplatePage.module.css";

function Meny() {
	return (
		<>
			<MenyItem
				path={"/dare/form"}
				linkText="Oppdragslab"
				description="Test oppgdrag med trekk"
				icon={<TestFlaskIcon style={{ fontSize: "2rem" }} />}
			/>
			<MenyItem
				path={"/dare/testberegning"}
				linkText="Testberegning"
				description="Lag en testberegning fra XML"
			/>
			<MenyItem
				path={"/dare/oppdrag"}
				linkText="Send inn en oppdrags-XML"
				description="Oppdragsbygger! Send et faktisk oppdrag inn til PoC"
				icon={<WrenchIcon style={{ fontSize: "2rem" }} />}
			/>
			<MenyItem
				path={"/dare/form"}
				linkText="Utførte bereninger"
				description="Se på utførte beregninger"
				icon={<SackKronerIcon style={{ fontSize: "2rem" }} />}
			/>
		</>
	);
}

export default function Poc() {
	return (
		<div className={styles["template-body"]}>
			<div className={styles["template-header"]}>
				<Heading spacing level="1" size="large">
					Dare POC
				</Heading>
				<Meny />
			</div>
		</div>
	);
}
