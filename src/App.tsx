import "./App.css";
import { EngineProvider } from "@/state/engine";
import { BoardContainer } from "@/components";

function App() {
  return (
    <EngineProvider>
      <BoardContainer
        borderStyle="solid"
        borderColor="black"
        borderWidth="8px"
      />
    </EngineProvider>
  );
}

export default App;
