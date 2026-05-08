import type React from "react";
import type { Beregningspresentasjon } from "../types/Beregning";
import BeregningsTabell from "./BeregningsTabell";

export const Beregningskontekst: React.FC<{
	beregningspresentasjon: Beregningspresentasjon;
	showCapacity?: boolean;
}> = ({ beregningspresentasjon, showCapacity }) => {
	return (
		<>
			{beregningspresentasjon.beregninger.map((b) => (
				<BeregningsTabell
					key={b.id}
					beregning={b}
					showCapacity={showCapacity}
				/>
			))}
		</>
	);
};
