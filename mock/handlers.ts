import { HttpResponse, http } from "msw";

export const handlers = [
  http.post("/dare-poc-api/api/oppdrag/2.5", () => {
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
          values: [974, 974, 974, 974, 974, 0, 0, 974, 974, 974, 974, 974],
          ekstra: [],
        },
        {
          rowName: "Sk.red.trekk",
          singleVal: false,
          values: [-100, -100, -100, -100, -100, 0, 0, 0, 0, 0, 0, 0],
          ekstra: [],
        },
        {
          rowName: "Skatt",
          singleVal: true,
          values: [-4620],
          ekstra: [
            {
              type: "no.nav.sokos.dare.poc.domain.ProsentExtraInfo",
              grunnlag: 9240,
              skatteInfo: {
                type: "no.nav.sokos.dare.poc.skattekort.DefaultSkatteTrekk",
                fagomraade: "AAP",
                prosentSats: 50,
              },
            },
          ],
        },
        {
          rowName: "UtleggsTrekk",
          singleVal: true,
          values: [-1000],
          ekstra: [],
        },
        {
          rowName: "Refusjonskrav",
          singleVal: false,
          values: [
            -150, -150, -150, -150, -150, 0, 0, -150, -150, -150, -150, -150,
          ],
          ekstra: [],
        },
      ],
      sums: {
        rowName: "Sum",
        singleVal: false,
        values: [724, 724, 724, 724, 724, 0, 0, 824, 824, 824, 824, 824],
        ekstra: [],
      },
      sumColumn: [9740, -500, -4620, -1000, -1500],
    });
  }),
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
