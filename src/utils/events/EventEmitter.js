import { EventEmitter } from "fbemitter";

export const E = {
  board_onTemplateChanged: "board_onTemplateChanged",
  onRestoreDefault: "onRestoreDefault",
  onCreatePunnetSquare: "onCreatePunnetSquare",
  onCrossResultClick: "onCrossResultClick"
};

export default new EventEmitter();