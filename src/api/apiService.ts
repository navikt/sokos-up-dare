import type { DateRange } from "@navikt/ds-react/src/date/Date.typeutils";
import type { Dispatch, SetStateAction } from "react";
import type { Beregning } from "../types/Beregning";
import type { FetchState } from "../types/FetchState";
import { BeregningSchema } from "../types/schema/BeregningSchema";
import type { Testberegning } from "../types/Testberegning";
import formatDate from "../util/date";
import { axiosPostFetcher } from "./config/apiConfig";

const BASE_URI = {
	BACKEND_API: "/dare-poc-api/api/",
};

const locale = navigator.languages?.[0] || navigator.language;

export async function testCalculation(
	beregning: Testberegning,
	range?: DateRange,
): Promise<Beregning> {
	return await axiosPostFetcher<string, Beregning>(
		BASE_URI.BACKEND_API,
		"/beregning/test",
		JSON.stringify(beregning),
		{
			headers: {
				"Content-Type": "text/xml",
				"Accept-Language": locale,
				...(range?.from && { "X-dateRange-from": formatDate(range.from) }),
				...(range?.to && { "X-dateRange-to": formatDate(range.to) }),
			},
		},
	);
}

export async function postOppdrag(
	setState: Dispatch<SetStateAction<FetchState<Beregning>>>,
	test: Testberegning,
	range: DateRange | undefined,
) {
	setState({ status: "loading" });
	try {
		const responseBody = await testCalculation(test, range);
		const response = BeregningSchema.safeParse(responseBody);
		if (!response.success) {
			// biome-ignore lint/suspicious/noConsole: ignore
			console.log("Error parsing ", response.error, responseBody);
			setState({ status: "error", error: "Feil i resultat" });
		} else {
			const beregning = BeregningSchema.parse(response.data);
			setState({ status: "success", data: beregning });
		}
	} catch (err) {
		setState({ status: "error", error: (err as Error).message });
	}
}
