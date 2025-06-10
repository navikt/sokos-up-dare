import { useEffect } from "react";
import Beregne from "./pages/Beregne";
import { initGrafanaFaro } from "./util/grafanaFaro";

export default function App() {
  useEffect(() => {
    if (import.meta.env.MODE !== "mock" && import.meta.env.MODE !== "backend")
      initGrafanaFaro();
  }, []);

  return <Beregne />;
}
