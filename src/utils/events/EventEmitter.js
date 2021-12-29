import { EventEmitter } from "fbemitter";

export const E = {
  board_onTemplateChanged: "board_onTemplateChanged",
  onRestoreDefault: "onRestoreDefault"
};

export default new EventEmitter();