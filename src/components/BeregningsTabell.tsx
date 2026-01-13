import { DownloadIcon } from "@navikt/aksel-icons";
import { Box, Button, HStack, Table, Tooltip, VStack } from "@navikt/ds-react";
import type React from "react";
import type { Beregning, Row } from "../types/Beregning";
import { dateStringToWeekday } from "../util/date";
import { generateCsv } from "../util/misc";
import styles from "./beregningsTabell.module.css";
import { ExtraInfoIcon } from "./ExtraInfo";

function capacitySum(row: Row) {
	return (
		(row.capacity?.dayCapacity.reduce((a, b) => a + b, 0) || 0) +
		(row.capacity?.lumpCapacity || 0)
	);
}

const BeregningsTabell: React.FC<{
	calc: Beregning;
	showCapacity?: boolean;
}> = ({ calc, showCapacity }) => {
	return (
		calc && (
			<Box padding={{ xs: "2", md: "6" }}>
				<VStack gap={"4"}>
					<div style={{ overflowX: "auto", width: "100%" }}>
						<Table
							id="beregningstabell"
							key={JSON.stringify(calc)}
							className={styles.table}
						>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell scope="col" className={styles.stickyLeft}>
										Dag
									</Table.HeaderCell>
									{calc.columns.map((date) => (
										<Table.HeaderCell align={"right"} key={date} scope="col">
											<Tooltip
												content={`Dato: ${dateStringToWeekday(date)}, ${date}`}
											>
												<span>{date}</span>
											</Tooltip>
										</Table.HeaderCell>
									))}
									<Table.HeaderCell
										align={"right"}
										scope="col"
										style={{ width: "7em" }}
										className={styles.stickyRight}
									>
										Enkeltbeløp
									</Table.HeaderCell>
									<Table.HeaderCell
										align={"right"}
										scope="col"
										style={{ width: "2em" }}
										className={styles.sticky}
									>
										Sum
									</Table.HeaderCell>
									<Table.HeaderCell
										className={styles.sticky}
										style={{ minWidth: "20px" }}
									></Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{calc.rows.map((row: Row, index: number) => (
									<Table.Row key={row.rowName}>
										<Table.HeaderCell
											scope="row"
											className={styles.stickyLeft}
											style={{ maxWidth: "4em" }}
										>
											{row.rowName}
										</Table.HeaderCell>

										{row.columnValues.length !== 0
											? row.columnValues.map((n: number, i: number) => (
													// biome-ignore lint/suspicious/noArrayIndexKey: ignore
													<Table.DataCell align={"right"} key={`row${i}`}>
														{n}{" "}
														{showCapacity &&
															row.capacity &&
															`(${row.capacity.dayCapacity[i]})`}
													</Table.DataCell>
												))
											: calc.columns.map((_d, i) => (
													// biome-ignore lint/suspicious/noArrayIndexKey: ignore
													<Table.DataCell align={"right"} key={`row${i}`}>
														{showCapacity &&
															row.capacity &&
															`(${row.capacity.dayCapacity[i]})`}
													</Table.DataCell>
												))}
										<Table.DataCell
											align={"right"}
											className={styles.stickyRight}
										>
											{row.rowValue}
											{showCapacity && `(${row.capacity?.lumpCapacity || 0})`}
										</Table.DataCell>
										<Table.DataCell align={"right"} className={styles.sticky}>
											{calc.sumColumn[index]}{" "}
											{showCapacity && `(${capacitySum(row)})`}
										</Table.DataCell>
										<Table.DataCell
											style={{ minWidth: "20px" }}
											className={styles.sticky}
										>
											{row.ekstra && <ExtraInfoIcon data={row.ekstra} />}
										</Table.DataCell>
									</Table.Row>
								))}
								<Table.Row key={"Kapasitet"}>
									<Table.HeaderCell scope="row" className={styles.stickyLeft}>
										Kapasitet
									</Table.HeaderCell>
									{calc.sums.columnValues.map((n: number, i: number) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: ignore
										<Table.DataCell align={"right"} key={`sumrow${i}`}>
											{n}
										</Table.DataCell>
									))}
									<Table.DataCell
										align={"right"}
										key={`sumrowval`}
										className={styles.stickyRight}
									>
										{calc.sums.rowValue}
										{showCapacity &&
											calc.sums.capacity &&
											`(${calc.sums.capacity.lumpCapacity})`}
									</Table.DataCell>
									<Table.DataCell align={"right"} className={styles.sticky}>
										{calc.sumColumn.reduce((a, b) => a + b, 0)}
										{showCapacity &&
											calc.sums.capacity &&
											`(${calc.sums.capacity.lumpCapacity + calc.sums.columnValues.reduce((a, b) => a + b)})`}
									</Table.DataCell>
								</Table.Row>
							</Table.Body>
						</Table>
					</div>
					<HStack justify={"end"} gap={"2"}>
						<Button
							variant={"secondary-neutral"}
							onClick={() => {
								const csvString = generateCsv(calc);
								const blob = new Blob([csvString], {
									type: "text/csv;charset=utf-8;",
								});
								const url = URL.createObjectURL(blob);
								const a = document.createElement("a");
								a.href = url;
								a.download = "beregning.csv";
								a.click();
								URL.revokeObjectURL(url);
							}}
							iconPosition={"left"}
							icon={<DownloadIcon aria-hidden />}
						>
							CSV Export
						</Button>
					</HStack>
				</VStack>
			</Box>
		)
	);
};

export default BeregningsTabell;
