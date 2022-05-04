import { EventEmitter } from "fbemitter";

export const E = {
  board_onTemplateChanged: "board_onTemplateChanged",
  onRestoreDefault: "onRestoreDefault",
  onCreatePunnetSquare: "onCreatePunnetSquare",
  onCrossResultClick: "onCrossResultClick",
  onStatClick: "onStatClick",
  onPageSwitchToPunnetSquare: "onPageSwitchToPunnetSquare"
};

export default new EventEmitter();