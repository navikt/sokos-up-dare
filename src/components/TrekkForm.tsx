import { TrashIcon } from "@navikt/aksel-icons";
import {
	Box,
	Button,
	Checkbox,
	HelpText,
	HStack,
	Select,
	TextField,
	VStack,
} from "@navikt/ds-react";
import type React from "react";
import { TrekkSchema } from "../types/schema/TrekkSchema";
import type { Trekk, TrekkAlternativ } from "../types/Trekk";
import { clamp } from "../util/misc";
import DatoFelt from "./DatoFelt";

export function nyttTrekk(fom: string, tom: string): Trekk {
	return {
		beskrivelse: "Nytt trekk",
		trekkAlternativ: "LOPD",
		sats: 0,
		prioritet: 1,
		skattereduserende: false,
		datoFom: fom,
		datoTom: tom,
	};
}

type Props = {
	trekk: Trekk;
	update: (trekk: Trekk) => void;
	remove: () => void;
};

const trekkAlternativValues: TrekkAlternativ[] =
	TrekkSchema.shape.trekkAlternativ.options;

const trekkAlternativLabels: Record<TrekkAlternativ, string> = {
	LOPD: "Løpende dagsats",
	LOPM: "Løpende månedssats",
	LOPP: "Løpende prosentsats",
	SALD: "Saldotrekk dagsats",
	SALM: "Saldotrekk månedssats",
	SALP: "Saldotrekk prosentsats",
};

const TrekkForm: React.FC<Props> = ({ trekk, update, remove }) => {
	const erProsenttrekk = () => trekk.trekkAlternativ.endsWith("P");

	return (
		<HStack gap={"space-16"}>
			<TextField
				type={"text"}
				htmlSize={12}
				label={"Beskrivelse"}
				value={trekk.beskrivelse}
				onChange={(e) => update({ ...trekk, beskrivelse: e.target.value })}
			></TextField>
			<Select
				label="Trekkalternativ"
				value={trekk.trekkAlternativ}
				onChange={({ target: { value } }) =>
					update({ ...trekk, trekkAlternativ: value as TrekkAlternativ })
				}
			>
				{trekkAlternativValues.map((opt) => (
					<option key={opt} value={opt}>
						{trekkAlternativLabels[opt]}
					</option>
				))}
			</Select>
			<TextField
				type={"number"}
				htmlSize={6}
				label={"Sats"}
				{...(erProsenttrekk() && { max: 100, min: 0 })}
				value={erProsenttrekk() ? clamp(0, trekk.sats, 100) : trekk.sats}
				onChange={({ target: { value } }) =>
					update({
						...trekk,
						sats: erProsenttrekk()
							? clamp(0, parseInt(value, 10), 100)
							: parseInt(value, 10),
					})
				}
			></TextField>
			<VStack justify={"end"}>
				<Checkbox
					value="skattereduserende"
					checked={trekk.skattereduserende}
					onChange={(e) =>
						update({ ...trekk, skattereduserende: e.target.checked })
					}
				>
					Sk.red
				</Checkbox>
			</VStack>
			<DatoFelt
				label={"Fra og med"}
				value={trekk.datoFom}
				update={(e) => {
					update({ ...trekk, datoFom: e });
				}}
			/>
			<DatoFelt
				label={"Til og med"}
				value={trekk.datoTom}
				update={(e) => {
					update({ ...trekk, datoTom: e });
				}}
			/>
			<TextField
				type={"number"}
				htmlSize={3}
				label={"Pri."}
				min={1}
				max={15}
				value={trekk.prioritet}
				onChange={({ target: { value } }) =>
					update({ ...trekk, prioritet: clamp(0, parseInt(value, 10), 15) })
				}
			></TextField>

			<VStack justify={"end"}>
				<Button
					variant="secondary"
					title="Slett trekk"
					icon={<TrashIcon fontSize="1.5rem" />}
					onClick={() => remove()}
				></Button>
			</VStack>
		</HStack>
	);
};

const TrekkListe: React.FC<{
	trekk?: Trekk[];
	update: (trekk: Trekk[]) => void;
}> = ({ trekk, update }) => {
	return (
		trekk &&
		trekk.length > 0 && (
			<Box
				as="header"
				padding="2"
				borderWidth="1"
				borderColor={"border-alt-3"}
				borderRadius={{ md: "large" }}
			>
				<HStack>
					Trekk ({trekk.length}){" "}
					<HelpText title="Merknad">Ikke alle parametre har effekt.</HelpText>
				</HStack>
				{trekk?.map((t: Trekk, idx: number) => (
					<TrekkForm
						// biome-ignore lint/suspicious/noArrayIndexKey: ignore
						key={`trekk-${idx}`}
						trekk={t}
						update={(updated: Trekk) =>
							update([...trekk.slice(0, idx), updated, ...trekk.slice(idx + 1)])
						}
						remove={() =>
							update([...trekk.slice(0, idx), ...trekk.slice(idx + 1)])
						}
					/>
				))}
			</Box>
		)
	);
};

export default TrekkListe;
