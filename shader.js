// http://www.youtube.com/watch?v=rfQ8rKGTVlg#t=25m03s
var sampleAs3DTexture = [
"vec4 sampleAs3DTexture(sampler2D tex, vec3 texCoord, float size) {"
  , "float sliceSize = 1.0 / size;                         // space of 1 slice"
  , "float slicePixelSize = sliceSize / size;              // space of 1 pixel"
  , "float sliceInnerSize = slicePixelSize * (size - 1.0); // space of size pixels"
  , "float zSlice0 = min(floor(texCoord.z * size), size - 1.0);"
  , "float zSlice1 = min(zSlice0 + 1.0, size - 1.0);"
  , "float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;"
  , "float s0 = xOffset + (zSlice0 * sliceSize);"
  , "float s1 = xOffset + (zSlice1 * sliceSize);"
  , "vec4 slice0Color = texture2D(tex, vec2(s0, texCoord.y));"
  , "vec4 slice1Color = texture2D(tex, vec2(s1, texCoord.y));"
  , "float zOffset = mod(texCoord.z * size, 1.0);"
  , "return mix(slice0Color, slice1Color, zOffset);"
, "}" ].join('\n')

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

        "vec4 texel = texture2D( tDiffuse, vUv );",
        "vec4 mapped = sampleAs3DTexture(tColorist, texel.rgb, 33.0);",
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
