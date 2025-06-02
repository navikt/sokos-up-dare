import useSWRImmutable from "swr/immutable";
import { Beregning } from "../types/Beregning";
import { axiosPostFetcher } from "./config/apiConfig";

const BASE_URI = {
  BACKEND_API: "/dare-poc-api/api/v1",
};

function swrConfig<T>(fetcher: (uri: string) => Promise<T>) {
  return {
    fetcher,
    suspense: true,
    revalidateOnFocus: false,
    refreshInterval: 600000,
  };
}

export function useGetCalculation() {
  const { data, error, isValidating } = useSWRImmutable<Beregning>(
    `/oppdrag`,
    swrConfig<Beregning>((url) =>
      axiosPostFetcher<string, Beregning>(BASE_URI.BACKEND_API, url),
    ),
  );

  const isLoading = (!error && !data) || isValidating;
  return { data, error, isLoading };
}
