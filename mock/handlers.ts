import { HttpResponse, http } from "msw";

export const handlers = [
  http.post("/dare-poc-api/api/v1/oppdrag", () => {
    return HttpResponse.json({
      columnNames: [
        "man.",
        "tir.",
        "ons.",
        "tor.",
        "fre.",
        "lør.",
        "søn.",
        "man.",
        "tir.",
        "ons.",
        "tor.",
        "fre.",
      ],
      rows: [
        {
          rowName: "Ytelse",
          singleVal: false,
          values: [974, 974, 974, 974, 974, 0, 0, 974, 974, 974, 974, 974],
        },
        {
          rowName: "Sk.red.trekk",
          singleVal: false,
          values: [-100, -100, -100, -100, -100, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          rowName: "Skatt",
          singleVal: true,
          values: [-1238],
        },
        {
          rowName: "UtleggsTrekk",
          singleVal: true,
          values: [-1000],
        },
        {
          rowName: "Refusjonskrav",
          singleVal: false,
          values: [
            -150, -150, -150, -150, -150, 0, 0, -150, -150, -150, -150, -150,
          ],
        },
      ],
      sums: {
        rowName: "Sum",
        singleVal: false,
        values: [724, 724, 724, 724, 724, 0, 0, 824, 824, 824, 824, 824],
      },
      sumColumn: [9740, -500, -1238, -1000, -1500],
    });
  }),
];
