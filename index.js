var lut = require('lut')
  , SampleShader = require('./shader')

function Colorist(processor, options) {
  if (!(this instanceof Colorist)) return new Colorist(processor, options)
  var THREE = this.THREE = processor.THREE
    , self = this
    , canvas

  this.shader = SampleShader(processor, THREE)

  options = options || {}
  options.table = options.table || lut(33, 33, 33)

  this.pass = new processor.ShaderPass(this.shader)
  processor.addPass(this.pass)

  this.table(options.table)
};

Colorist.prototype.snapshot = function(original) {
  var renderer = game.renderer || game.view.renderer
    , parent = renderer.domElement
    , canvas = document.createElement('canvas')
    , ctx = canvas.getContext('2d')
    , image = new Image

  if (original) {
    renderer.render(game.scene, game.camera)
  } else {
    game.render()
  }

  canvas.width = parent.width
  canvas.height = parent.height
  canvas.getContext('2d').drawImage(parent, 0, 0)

  if (original) {
    lut(33, 33, 33, canvas)
  } else {
    canvas.getContext('2d').drawImage(this.tableTexture.image, 0, 0)
  }

  image.src = canvas.toDataURL()

  return image
};

Colorist.prototype.table = function(table) {
  var self = this
    , canvas

  function ready() {
    var pass = self.pass;

    if (self.tableTexture) {
      self.tableTexture.image = canvas;
    } else {
      self.tableTexture = new self.THREE.Texture(canvas);
    }

    self.tableTexture.magFilter = self.THREE.NearestFilter;
    self.tableTexture.minFilter = self.THREE.LinearMipMapLinearFilter;
    self.tableTexture.wrapT     = self.THREE.RepeatWrapping;
    self.tableTexture.wrapS     = self.THREE.RepeatWrapping;
    self.tableTexture.needsUpdate = true;

    pass.uniforms.tColorist.value = self.tableTexture;
  };

  if (typeof table === 'string' || table.nodeName === 'img') {
    canvas = imageToCanvas(table, ready);
  } else {
    canvas = clipCanvas(table);
    ready();
  }
};

function imageToCanvas(src, callback) {
  if (src.nodeName === 'canvas') return src
  callback = callback || function(){}

  var canvas = document.createElement('canvas')
    , ctx = canvas.getContext('2d')
    , image

  if (typeof src !== 'string') {
    src = src.src
  }

  image = new Image
  image.onload = function() {
    canvas.width = 33 * 33
    canvas.height = 33
    ctx.drawImage(image, 0, 0)
    callback()
  };
  image.src = src

  return canvas
};

function clipCanvas(original) {
  var updated = document.createElement('canvas')
    , ctx = original.getContext('2d')
    , imageData = ctx.getImageData(0, 0, 33 * 33, 33)

  updated.width = 33 * 33
  updated.height = 33
  updated.getContext('2d').putImageData(imageData, 0, 0)

  return updated
}

module.exports = Colorist
