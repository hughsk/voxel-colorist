var sampleAs3DTexture = require('webgl-texture3d')(null, 33)

module.exports = function(composer) {
  var THREE = composer.THREE
  var shader = {
    vertexShader: composer.CopyShader.vertexShader,
    fragmentShader: [
      "uniform sampler2D tDiffuse;",
      "uniform sampler2D tColorist;",
      "varying vec2 vUv;",

      sampleAs3DTexture,

      "void main() {",

        // Using a 33^3 table instead of 32^3, because for some reason
        // the pixels get weird at that resolution.
        "vec4 texel = texture2D( tDiffuse, vUv );",
        "vec4 mapped = sampleAs3DTexture(tColorist, texel.rgb);",
        "gl_FragColor = mapped;",

      "}"
    ].join('\n')
  }

  shader.uniforms = THREE.UniformsUtils.merge([
    composer.CopyShader.uniforms, {
      tColorist: { type: 't', value: null }
    }
  ])

  return shader
};
