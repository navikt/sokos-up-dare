import { type JSX, useEffect } from "react";
import { BrowserRouter, Route, Routes, useRouteError } from "react-router";
import Beregne from "./pages/Beregne";
import { Oppdrag } from "./pages/Oppdrag";
import { initGrafanaFaro } from "./util/grafanaFaro";

export default function App() {
	useEffect(() => {
		if (import.meta.env.MODE !== "mock" && import.meta.env.MODE !== "backend")
			initGrafanaFaro();
	}, []);

	return (
		<BrowserRouter basename={"/dare"}>
			<Routes>
				<Route path={"/"} ErrorBoundary={ErrorBoundary}>
					<Route path={"/"} element={<Beregne />} />
					<Route path={"/form"} element={<Oppdrag />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

function ErrorBoundary(): JSX.Element {
	throw useRouteError();
}
