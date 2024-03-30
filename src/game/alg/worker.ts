import { PossibleLayout, getPossibleBoards } from ".";
import { TetrominoType } from "@/game/constants";

// Worker message event listener
self.onmessage = (e) => {
  const {
    layout,
    tetrominoType,
  }: { layout: PossibleLayout; tetrominoType: TetrominoType } = e.data;
  const possibleLayouts = getPossibleBoards(layout, tetrominoType);
  postMessage(possibleLayouts);
};
