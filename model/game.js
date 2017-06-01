/*
 * The main class handling updates and graphics
 */

class Game extends createjs.Stage {

  constructor (canvasName) {
    super(canvasName);

    this.tickEnabled  = true;
    this.txtFps       = new QuickText({ x: 10, y: 10 });
    this.txtrendertime= new QuickText({ x: 10, y: 30 });

    this.setHandlers();

    this.addChild(this.txtFps);
    this.addChild(this.txtrendertime);
  }

  setHandlers () {
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", this.update, this);
  }

  update (e) {
    this.txtFps.text = createjs.Ticker.getMeasuredFPS().toFixed(0) + " FPS";
    this.rendertime = 0;
    let time = performance.now();
    if (!e.paused) {
      super.update(e);
    }
    game.rendertime += (performance.now() - time);
    this.txtrendertime.text = "render time " + this.rendertime.toPrecision(3) + " ms";
  }

  addChild (child) {
    super.addChild(child);
  }

  removeChild (child) {
    super.removeChild(child);
  }

}
