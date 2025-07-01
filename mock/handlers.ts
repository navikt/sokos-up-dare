import { HttpResponse, http } from "msw";

export const handlers = [
  http.post("/dare-poc-api/api/beregning/test", () => {
    return HttpResponse.json({
      columns: [
        "2025-03-31",
        "2025-04-01",
        "2025-04-02",
        "2025-04-03",
        "2025-04-04",
        "2025-04-05",
        "2025-04-06",
        "2025-04-07",
        "2025-04-08",
        "2025-04-09",
        "2025-04-10",
        "2025-04-11",
      ],
      rows: [
        {
          rowName: "Ytelse",
          singleVal: false,
          values: [800, 800, 800, 800, 800, 0, 0, 800, 800, 800, 800, 800],
          ekstra: [],
        },
        {
          rowName: "Skatt",
          singleVal: true,
          values: [-813],
          ekstra: [
            {
              type: "no.nav.sokos.dare.poc.domain.TabellExtraInfo",
              grunnlag: 8000,
              skatteInfo: {
                trekktabell: "8010",
                inntektsAar: 2025,
                skattekortIdentifikator: 1,
                utstedtDato: "2025-06-30",
              },
              skatteDager: 14,
            },
          ],
        },
      ],
      sums: {
        rowName: "Sum",
        singleVal: false,
        values: [800, 800, 800, 800, 800, 0, 0, 800, 800, 800, 800, 800],
        ekstra: [],
      },
      sumColumn: [8000, -813],
    });
  }),
];
