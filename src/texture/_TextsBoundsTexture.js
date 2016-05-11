(function(Blotter, _, THREE, Detector, requestAnimationFrame, EventEmitter, GrowingPacker, setImmediate) {

  // Create a Data Texture holding the boundaries (x/y offset and w/h) that should be available to any given texel for any given text.

  Blotter._TextsBoundsTexture = function (mapper) {
    this._mapper = mapper;
    this._texts = this._mapper.texts;
    this._width = this._mapper.width;
    this._height = this._mapper.height;
    this._ratio = this._mapper.ratio;

    // Stub texture - resets on build.
    this.texture = new THREE.DataTexture([], 0, 0, THREE.RGBAFormat, THREE.FloatType);

    _.extendOwn(this, EventEmitter.prototype);
  };

  Blotter._TextsBoundsTexture.prototype = (function () {

    function _spriteBounds (completion) {
      var data = new Float32Array(this._texts.length * 4);

      setImmediate(_.bind(function() {
        for (var i = 0; i < this._texts.length; i++) {
          var text = this._texts[i],
              bounds = this._mapper.boundsFor(text);

          data[4*i]   = bounds.fit.x * this._ratio;                                             // x
          data[4*i+1] = (this._height * this._ratio) - ((bounds.fit.y + bounds.h) * this._ratio); // y
          data[4*i+2] = bounds.w * this._ratio;                                                 // w
          data[4*i+3] = bounds.h * this._ratio;                                                 // h
        }

        completion(data);
      }, this));
    }

    return {

      constructor : Blotter._TextsBoundsTexture,

      build : function () {
        _spriteBounds.call(this, _.bind(function(spriteData) {
          this.texture = new THREE.DataTexture(spriteData, this._texts.length, 1, THREE.RGBAFormat, THREE.FloatType);
          this.texture.needsUpdate = true;

          this.trigger("build");
        }, this));
      }
    };
  })();

})(
  this.Blotter, this._, this.THREE, this.Detector, this.requestAnimationFrame, this.EventEmitter, this.GrowingPacker, this.setImmediate
);
