import {
  Beregning,
  ExtraInfo,
  OverstyrtSkatteKortExtraInfo,
  ProsentExtraInfo,
  Row,
  TabellExtraInfo,
} from "../types/Beregning";
import { ExtraInfoTypes } from "../types/schema/ExtraInfoSchema";

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export function csvEscape(field: string | number) {
  const str = String(field);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function capitalize(str: string) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

export function generateCsv(calc: Beregning): string {
  function formatMetaData(info: ExtraInfo | object) {
    const extraInfo = info as ExtraInfo;
    switch (extraInfo.type) {
      case ExtraInfoTypes.OverstyrtSkatteKort: {
        const o = info as OverstyrtSkatteKortExtraInfo;
        return csvEscape(
          `Overstyrt skattekort. Grunnlag: ${o.grunnlag}, Prosentsats: ${o.prosentSats}, grunn: ${o.grunn}`,
        );
      }
      case ExtraInfoTypes.ProsentExtraInfo: {
        const p = info as ProsentExtraInfo;
        return csvEscape(
          `Prosenttrekk. Grunnlag: ${p.grunnlag}, Prosentsats: ${p.skatteInfo.prosentSats}`,
        );
      }
      case ExtraInfoTypes.TabellExtraInfo: {
        const t = info as TabellExtraInfo;
        return csvEscape(
          `Tabelltrekk Grunnlag: ${t.grunnlag}, Tabell: ${t.skatteInfo.trekktabell}, Inntektsår: ${t.skatteInfo.inntektsAar}, SkattekortID: ${t.skatteInfo.skattekortIdentifikator}, skattekortdato: ${t.skatteInfo.utstedtDato}, Skattedager: ${t.skatteDager}`,
        );
      }
      default:
        return csvEscape(`Ukjent ekstra-info: ${JSON.stringify(info)}`);
    }
  }

  function rowFormat(row: Row, index: number): string {
    const metaData =
      row.ekstra && row.ekstra.length
        ? "," + row.ekstra.map(formatMetaData).join(";")
        : "";

    if (row.singleVal) {
      return (
        csvEscape(row.rowName) +
        ",".repeat(calc.columns.length + 1) +
        calc.sumColumn[index] +
        metaData
      );
    } else {
      return (
        csvEscape(row.rowName) +
        "," +
        row.values.join(",") +
        "," +
        calc.sumColumn[index] +
        metaData
      );
    }
  }

  const data = [
    "dato," + calc.columns.join(",") + ",sum,ekstra",
    ...calc.rows.map(rowFormat),
    calc.sums.rowName +
      "," +
      calc.sums.values.join(",") +
      "," +
      sum(calc.sums.values),
  ];
  return data.join("\n");
}
