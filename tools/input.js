class Input extends createjs.EventDispatcher {

  constructor () {
    super();

    this.keys = {
      mouse1  : false,
      mouse2  : false,
      left    : false,
      right   : false,
      up      : false,
      down    : false,
      forward : false,
      backward: false
    };
    this.aimDelta = $V([0,0]);
    this.mouseDelta = $V([0,0]);

    // changeable bindings
    this.bindings = {
      left    : "q",
      right   : "d",
      up      : "a",
      down    : "e",
      forward : "z",
      backward: "s"
    };

    // native events listeners
    window.addEventListener("keydown", e => this.getEvent(e), true);
    window.addEventListener("keyup", e => this.getEvent(e), true);
    window.addEventListener("mousedown", e => this.getEvent(e), true);
    window.addEventListener("mouseup", e => this.getEvent(e), true);
    window.addEventListener("mousemove", e => this.getEvent(e), true);
    window.addEventListener("focus", e => this.getEvent(e), false);
    window.addEventListener("blur", e => this.getEvent(e), false);
    $("#game").on("contextmenu", null, null, false); // to prevent right click menu
    document.addEventListener("pointerlockchange",  () => {});
  }

  getEvent (e) {
    const custEvent = new createjs.Event("");

    switch (e.type) {
      case "mousedown":
        switch (e.button) {
          case 0:
            this.keys.mouse1 = true;
            break;
          case 2:
            this.keys.mouse2 = true;
            break;
        }
        break;
      case "mouseup":
        switch (e.button) {
          case 0:
            this.keys.mouse1 = false;
            break;
          case 2:
            this.keys.mouse2 = false;
            break;
        }
        break;
      case "keydown": {
        this.keys[e.key] = true;
        let type = Object.keys(this.bindings).find(key => {
          if (e.key === this.bindings[key]) {
            this.keys[key] = true;
            return true;
          }
        });
        custEvent.type = (type ? type : "");
        } break;
      case "keyup": {
        this.keys[e.key] = false;
        let type = Object.keys(this.bindings).find(key => {
          if (e.key === this.bindings[key]) {
            this.keys[key] = false;
            return true;
          }
        });
        custEvent.type = (type ? type + "U" : "");
        } break;
      case "focus" : break;
      case "blur" :
        document.exitPointerLock();
        break;
      case "mousemove" :
        if (document.pointerLockElement) {
          custEvent.type = "lockedmousemove";
          this.mouseDelta = $V([e.movementX, e.movementY]);
          this.aimDelta = this.aimDelta.add(this.mouseDelta);
        } else
          this.mouseDelta = $V([0,0]);
        break;
    }
    custEvent.original = e;
    custEvent.type && this.dispatchEvent(custEvent);

    const defEvent = new createjs.Event(e.type);
    defEvent.original = e;
    this.dispatchEvent(defEvent);
  }

  updateDelta() {
    // this.aimDelta = $V([
    //     Number(-this.keys.aimRight + this.keys.aimLeft),
    //     Number(-this.keys.aimUp + this.keys.aimDown)
    // ]);
  }

}

const input = new Input();
