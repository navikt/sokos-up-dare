import { DateTime } from "luxon";

export function formatDate(d: Date | undefined): string | undefined {
  return (
    d &&
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  );
}

export function dateStringToWeekday(date: string): string {
  const weekday = new Date(date).toLocaleDateString("no-NO", {
    weekday: "long",
  });
  return weekday[0].toUpperCase() + weekday.slice(1);
}

export default formatDate;

export function formatXmlDate(stringDate: string): string {
  const dt = DateTime.fromISO(stringDate, { zone: "Europe/Oslo" });
  return stringDate + dt.toFormat("ZZ");
}
