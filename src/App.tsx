import "./App.css";
import { EngineProvider } from "@/state/engine";
import { BoardContainer, GameContainer } from "@/containers";

function App() {
  return (
    <EngineProvider>
      <GameContainer />
    </EngineProvider>
  );
}

export default App;
