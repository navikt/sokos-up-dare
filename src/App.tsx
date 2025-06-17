import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Beregne from "./pages/Beregne";
import { Oppdrag } from "./pages/Oppdrag";
import { initGrafanaFaro } from "./util/grafanaFaro";

export default function App() {
  useEffect(() => {
    if (import.meta.env.MODE !== "mock" && import.meta.env.MODE !== "backend")
      initGrafanaFaro();
  }, []);

  return (
    <BrowserRouter basename={"/"}>
      <Routes>
        <Route path={"/dare/"} element={<Beregne />} />
        <Route path={"/dare/form"} element={<Oppdrag />} />
      </Routes>
    </BrowserRouter>
  );
}
