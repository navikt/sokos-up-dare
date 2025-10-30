import { useEffect } from "react";
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

export const clamp = (min: number, value: number, max: number) =>
  Math.min(max, Math.max(min, value));

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

    return (
      csvEscape(row.rowName) +
      "," +
      (row.columnValues.length > 0
        ? row.columnValues.join(",")
        : ",".repeat(calc.columns.length - 1)) +
      "," +
      row.rowValue +
      "," +
      calc.sumColumn[index] +
      metaData
    );
  }

  const data = [
    "dato," + calc.columns.join(",") + ",periode,sum,ekstra",
    ...calc.rows.map(rowFormat),
    calc.sums.rowName +
      "," +
      calc.sums.columnValues.join(",") +
      "," +
      calc.sums.rowValue +
      "," +
      sum(calc.sums.columnValues),
  ];
  return data.join("\n");
}

// Easter egg
export function useFlaskBubbles(selector = "#testflask") {
  useEffect(() => {
    const svg = document.querySelector(selector) as SVGSVGElement | null;
    if (!svg) return;

    // avoid duplicating in dev or re-renders
    if (svg.querySelector("g[data-bubbles]")) return;

    // ensure we have a viewBox so positions are in SVG units
    if (!svg.getAttribute("viewBox")) {
      const bbox = svg.getBBox();
      svg.setAttribute(
        "viewBox",
        `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`,
      );
    }

    const vb = svg.viewBox.baseVal; // SVG coord system
    const r = vb.width * 0.1; // bubble radius proportional to icon size

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("data-bubbles", "true");

    // 3 bubbles placed in SVG units so they scale with the icon
    const makeBubble = (
      cx: number,
      cy: number,
      radius: number,
      delay: number,
      cls: string,
    ) => {
      const c = document.createElementNS(svg.namespaceURI, "circle");
      c.setAttribute("class", `bubble ${cls}`);
      c.setAttribute("cx", String(cx));
      c.setAttribute("cy", String(cy));
      c.setAttribute("r", String(radius));
      c.setAttribute("fill", "currentColor");
      c.setAttribute("style", `animation-delay:${delay}s`);
      return c;
    };

    g.append(
      makeBubble(
        vb.x + vb.width * 0.55,
        vb.y + vb.height * 0.775,
        r * 0.9,
        0.0,
        "b1",
      ),
      makeBubble(
        vb.x + vb.width * 0.45,
        vb.y + vb.height * 0.782,
        r * 0.7,
        0.6,
        "b2",
      ),
      makeBubble(
        vb.x + vb.width * 0.6,
        vb.y + vb.height * 0.786,
        r * 0.6,
        1.2,
        "b3",
      ),
    );

    // lightweight CSS-in-SVG for animation
    const style = document.createElementNS(svg.namespaceURI, "style");
    style.textContent = `
      .bubble {
        transform-box: fill-box;
        transform-origin: center;
        animation: bubble-rise 2.6s infinite ease-in;
        opacity: 0;
      }
      @keyframes bubble-rise {
        0%   { transform: translateY(20%) scale(0.6); opacity: 0; }
        15%  { opacity: 1; }
        100% { transform: translateY(-140%) scale(1); opacity: 0; }
      }
    `;

    svg.appendChild(style);
    svg.appendChild(g);
  }, [selector]);
}
