import "./App.css";
import { EngineProvider } from "@/state/engine";
import { PredictGameContainer } from "@/containers";

function App() {
  return (
    <EngineProvider>
      <PredictGameContainer />
    </EngineProvider>
  );
}

export default App;
