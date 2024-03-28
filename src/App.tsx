import "./App.css";
import { EngineProvider } from "@/state/engine";
import { GameContainer } from "@/containers";

function App() {
  return (
    <EngineProvider>
      <GameContainer />
    </EngineProvider>
  );
}

export default App;
