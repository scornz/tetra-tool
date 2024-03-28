import "./App.css";
import { EngineProvider } from "@/state/engine";
import { BoardContainer, GameContainer } from "@/containers";
import { useEffect } from "react";
import { TESTING_LAYOUT, TetrominoType } from "@/game/constants";
import { getPossibleBoards, getPossibleBoardsFromQueue } from "@/game/alg";

function App() {
  useEffect(() => {
    console.time("possible");
    console.log(
      getPossibleBoardsFromQueue(TESTING_LAYOUT, [
        TetrominoType.I,
        TetrominoType.T,
        TetrominoType.L,
      ]).length
    );
    console.timeEnd("possible");
  }, []);

  return (
    <EngineProvider>
      <GameContainer />
    </EngineProvider>
  );
}

export default App;
