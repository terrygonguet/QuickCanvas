/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

/**
 * Rounds the number to the desired precision
 *
 * @param {Number} precision
 * @returns number
 */
Number.prototype.roundPres = function(precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = this * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

/**
 * Returns a random integer in the range.
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 */
Math.randInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Returns a random float in the range.
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 */
Math.randFloat = function (min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * @returns {String} a random RGB CSS value
 */
Math.randomRGB = function () {
  return "rgb(" + Math.randInt(0,255) + ", " + Math.randInt(0,255) + ", " + Math.randInt(0,255) + ")";
}

// http://codereview.stackexchange.com/questions/83717/filter-out-duplicates-from-an-array-and-return-only-unique-value
function unique (xs) {
  var seen = {};
  return xs.filter(function(x) {
    if (seen[x])
      return;
    seen[x] = true;
    return x;
  });
}

// http://stackoverflow.com/questions/21646738/convert-hex-to-rgba
function hexToRgbA(hex, alpha){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
}

/**
 * creates a settings object to be used by constructors
 * @param {Object} defaults the dictionary of defaults to be overriden
 * @param {Object} params the dictionary of values
 * @return {Object} the completed settings object
 */
function makeSettings(defaults, params) {
  const ret = _.assign(defaults, params);
  _.forOwn(ret, (v, k) => {
    if (_.xor(_.keys(v), ["x", "y"]).length === 0) {
      ret[k] = $V([v.x, v.y]);
    }
  });
  return ret;
}

/**
 * Transform a sylvester vector into a Matter Vector
 * @return {Matter.Vector} the same vector but from Matter
 */
Vector.prototype.toM = function () {
  return Matter.Vector.create(this.e(1), this.e(2));
};

/**
 * Restricts the vector to a box of specified dimensions with 0,0 in the center
 * @param {Array} dimensions the dimensions of the box
 */
Vector.prototype.clamp = function (dimensions) {
  return $V(this.elements.map((e, i) => e.clamp(-dimensions[i]/2, dimensions[i]/2)));
}

/**
 * Transform a Matter vector into a sylvester Vector
 * @param {Matter.Vector}
 * @return {Vector} the same vector but from sylvester
 */
function toSylv (v) {
  return $V([v.x, v.y]);
};

/**
 * Returns the next unique ID (only unique for this instance)
 * In its own namespace so that id isn't accessible
 */
var nextID = null;
(function () {
  var id = 0;
  nextID = function () {
    return id++;
  }
})();
