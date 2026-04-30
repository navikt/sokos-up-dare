import type { Dispatch, SetStateAction } from "react";
import type { Beregning } from "../types/Beregning";
import type { DateRange } from "../types/DateRange";
import type { FetchState } from "../types/FetchState";
import {
	BeregningListSchema,
	BeregningSchema,
} from "../types/schema/BeregningSchema";
import type { Testberegning } from "../types/Testberegning";
import formatDate from "../util/date";
import { axiosFetcher, axiosPostFetcher } from "./config/apiConfig";

const BASE_URI = {
	BACKEND_API: "/dare-poc-api/api/",
};

const locale = navigator.languages?.[0] || navigator.language;

export async function postOppdrag(xml: string): Promise<Beregning> {
	return await axiosPostFetcher<string, Beregning>(
		BASE_URI.BACKEND_API,
		"/beregning/oppdrag",
		xml,
		{
			headers: {
				"Content-Type": "text/xml",
				"Accept-Language": locale,
			},
		},
	);
}

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

export async function postTestOppdrag(
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

export async function postOppdragXML(
	setState: Dispatch<SetStateAction<FetchState<Beregning>>>,
	xml: string,
) {
	setState({ status: "loading" });
	try {
		const responseBody = await postOppdrag(xml);
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

export async function findBeregninger(
	setState: Dispatch<SetStateAction<FetchState<Beregning[]>>>,
	datoFom: string,
	datoTom: string,
) {
	setState({ status: "loading" });
	try {
		const responseBody = await axiosFetcher<Beregning[]>(
			BASE_URI.BACKEND_API,
			`beregnet/1/?fra=${datoFom}&til=${datoTom}`,
		);

		const response = BeregningListSchema.safeParse(responseBody);
		if (!response.success) {
			// biome-ignore lint/suspicious/noConsole: ignore
			console.log("Error parsing ", response.error, responseBody);
			setState({ status: "error", error: "Feil i resultat" });
		} else {
			const beregninger = BeregningListSchema.parse(response.data);
			setState({ status: "success", data: beregninger });
		}
	} catch (err) {
		setState({ status: "error", error: (err as Error).message });
	}
}

export async function findBeregning(
	setState: Dispatch<SetStateAction<FetchState<Beregning>>>,
	beregningId: number,
) {
	setState({ status: "loading" });
	try {
		const responseBody = await axiosFetcher<Beregning>(
			BASE_URI.BACKEND_API,
			`beregnet/1/${beregningId}`,
		);

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
