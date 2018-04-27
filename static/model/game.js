/*
 * The main class handling updates and graphics
 */

 TP.classes.push(function () {
class Game extends createjs.Stage {

  /**
   * @param {String} canvasName ID of the <canvas> element to wrap
   */
  constructor (canvasName) {
    super(canvasName);
    // createjs props
    this.tickEnabled  = false;

    // other props
    this.txtFps       = new QuickText({ x: 10, y: 30, dontRemove: true });
    this.txtrendertime= new QuickText({ x: 10, y: 50, dontRemove: true });
    this.txtqwerty    = new QuickText({ x: 10, y: 10, text: debug ? "Escape for the menu" : "", dontRemove: true });
    this.renderVals   = [];
    this.camera       = new Camera();
    this.engine       = Matter.Engine.create();
    this.world        = this.engine.world;
    this.delta        = 1000 / 60;
    this.lastdelta    = 1000 / 60;
    this.player       = null;
    this.levelData    = null;
    this.maxdelta     = 150;
    this.isLoading    = false;

    this.setHandlers();
    this.addChild(this.txtFps);
    this.addChild(this.txtrendertime);
    this.addChild(this.txtqwerty);
  }

  /**
   * To separate the handlers from the constructor
   */
  setHandlers () {
    createjs.Ticker.timingMode = createjs.Ticker.RAF ;
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", this.update, this);

    function handleCollision(e) {
      for (let pair of e.pairs) {
        var a = pair.bodyA.displayObject;
        var b = pair.bodyB.displayObject;
        a[e.name] && a[e.name](pair);
        b[e.name] && b[e.name](pair);
      }
    }
    Matter.Events.on(this.engine, "collisionStart", handleCollision);
    Matter.Events.on(this.engine, "collisionActive", handleCollision);
    Matter.Events.on(this.engine, "collisionEnd", handleCollision);
  }

  get screencenter() {
    return $V([window.innerWidth/2, window.innerHeight/2]);
  }

  get scale() {
    return this.scaleX;
  }

  set scale(val) {
    this.scaleX = val;
    this.scaleY = val;
  }

  getChildByClass(className) {
    if (typeof className === "string")
      return this.children.find(c => c["is" + className]);
    else
      return this.children.find(c => c instanceof className);
  }

  gbc(name) {
    return this.getChildByClass(name);
  }

  getChildrenByClass(className) {
    if (typeof className === "string")
      return this.children.filter(c => c["is" + className]);
    else
      return this.children.filter(c => c instanceof className);
  }

  gbcs(name) {
    return this.getChildrenByClass(name);
  }

  getChildByID(id) {
    return this.children.find(c => c.id === id);
  }

  gbid(id) {
    return this.getChildByID(id);
  }

  /**
   * Cleans up the Stage and builds everything according to the data supplied
   * @param {Object} data : the Object from the server
   */
  init (data) {

  }

  toJSON() {
    
  }

  /**
   * @param {eventdata} e
   */
  update (e) {
    let time = performance.now(); // perf monitoring
    e.sdelta = e.delta / 1000; // shorthand
    this.txtFps.text = (debug ? createjs.Ticker.getMeasuredFPS().toFixed(0) + " FPS" : "");
    // more perf monitoring
    this.rendertime = 0;
    if (e.delta <= this.maxdelta && !e.paused) {
      this.children.forEach(c => c.update && c.update(e));
      this.delta = e.delta;
      Matter.Engine.update(this.engine, e.delta, this.delta/this.lastdelta);
      this.lastdelta = e.delta;
    }
    this.camera.update(e);
    super.update(e);
    game.rendertime += (performance.now() - time);
    this.renderVals.push(game.rendertime);
    if (this.renderVals.length > 100) this.renderVals.shift(); // render values smoother
    this.txtrendertime.text = (debug ? "render time " + (this.renderVals.reduce((a,b)=>a+b, 0)/100).toPrecision(3) + " ms" : "");
  }

  get collidables() {
    return this.children.filter(c => c.isCollidable);
  }

  addChild (child) {
    child.body && Matter.Composite.add(this.world, child.body);
    return super.addChild(child);
  }

  removeChild (child) {
    child.body && Matter.Composite.remove(this.world, child.body);
    return super.removeChild(child);
  }

}
TP.Game = Game;
window.Game = Game
})
