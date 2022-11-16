import tinygradient from "tinygradient";

export class GradientMaker {
  constructor(steps) {
    if (isNaN(steps)) {
      console.error("Steps argument must be a number!");
      return;
    }
    this.gradient = tinygradient(["#203c57", "#365720", "#572020"]);
    this.step = 1 / Number(steps);
    this.reset();
  }

  reset() {
    this.curr_p = 0;
  }

  nextColor() {
    console.log(this.curr_p);
    let res = this.currentColor();
    this.curr_p += this.step;
    return res;
  }

  currentColor() {
    return this.curr_p <= 1 && this.curr_p >= 0
      ? this.gradient.hsvAt(this.curr_p).toHexString()
      : null;
  }
}
