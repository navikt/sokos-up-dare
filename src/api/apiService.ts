import useSWR from "swr";
import { Beregning } from "../types/Beregning";
import { axiosPostFetcher } from "./config/apiConfig";

const BASE_URI = {
  BACKEND_API: "/dare-poc-api/api/",
};

function swrConfig<T>(fetcher: (uri: string) => Promise<T>) {
  return {
    fetcher,
    suspense: true,
    revalidateOnFocus: false,
  };
}

export function useGetCalculation(body: string): {
  data?: Beregning;
  error: string;
  isLoading: boolean;
} {
  const { data, error, isValidating } = useSWR<Beregning>(
    ["/oppdrag/2.5", body],
    swrConfig<Beregning>(([url, b]) =>
      axiosPostFetcher<string, Beregning>(BASE_URI.BACKEND_API, url, b, {
        headers: { "Content-Type": "text/xml" },
      }),
    ),
  );

  const isLoading = (!error && !data) || isValidating;
  return { data, error, isLoading };
}
