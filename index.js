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

  function ready() {
    var shaderPass = new processor.ShaderPass(self.shader)
    processor.addPass(shaderPass)
    self.tableTexture = shaderPass.uniforms.tColorist.value = new THREE.Texture(canvas)
    self.tableTexture.magFilter = THREE.NearestFilter;
    self.tableTexture.minFilter = THREE.LinearMipMapLinearFilter;
    self.tableTexture.wrapT     = THREE.RepeatWrapping;
    self.tableTexture.wrapS     = THREE.RepeatWrapping;
    self.tableTexture.needsUpdate = true
  };

  if (typeof options.table === 'string' || options.table.nodeName === 'img') {
    canvas = imageToCanvas(options.table, ready)
  } else {
    canvas = clipCanvas(options.table)
    ready()
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
