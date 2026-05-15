import { type JSX, useEffect } from "react";
import { BrowserRouter, Route, Routes, useRouteError } from "react-router";
import Beregne from "./pages/Beregne";
import Beregninger from "./pages/Beregninger";
import Beregningsdetailjer from "./pages/Beregningsdetailjer";
import { Oppdrag } from "./pages/Oppdrag";
import { OppdragsBygger } from "./pages/OppdragsBygger";
import Poc from "./pages/Poc";
import { initGrafanaFaro } from "./util/grafanaFaro";
import "@navikt/ds-css";

export default function App() {
	useEffect(() => {
		if (import.meta.env.MODE !== "mock" && import.meta.env.MODE !== "backend")
			initGrafanaFaro();
	}, []);

	return (
		<BrowserRouter basename={"/dare"}>
			<Routes>
				<Route path={"/"} ErrorBoundary={ErrorBoundary}>
					<Route path={"/"} element={<Poc />} />
					<Route path={"/testberegning"} element={<Beregne />} />
					<Route path={"/oppdrag"} element={<OppdragsBygger />} />
					<Route path={"/form"} element={<Oppdrag />} />
					<Route path={"/beregninger"} element={<Beregninger />} />
					<Route path={"/beregning/:id"} element={<Beregningsdetailjer />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

function ErrorBoundary(): JSX.Element {
	throw useRouteError();
}
