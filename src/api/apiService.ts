import { DateRange } from "@navikt/ds-react/src/date/Date.typeutils";
import { Beregning } from "../types/Beregning";
import { Testberegning } from "../types/Testberegning";
import formatDate from "../util/date";
import { axiosPostFetcher } from "./config/apiConfig";

const BASE_URI = {
  BACKEND_API: "/dare-poc-api/api/",
};

const locale = navigator.languages?.[0] || navigator.language;

export async function getCalculation(
  xmlBody: string,
  range?: DateRange,
): Promise<Beregning> {
  return await axiosPostFetcher<string, Beregning>(
    BASE_URI.BACKEND_API,
    "/oppdrag/2.5",
    xmlBody,
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
