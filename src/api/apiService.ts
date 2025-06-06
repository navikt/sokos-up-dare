import { DateRange } from "@navikt/ds-react/src/date/Date.typeutils";
import { Beregning } from "../types/Beregning";
import { axiosPostFetcher } from "./config/apiConfig";

const BASE_URI = {
  BACKEND_API: "/dare-poc-api/api/",
};

const formatDate = (d: Date | undefined) =>
  d &&
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

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
