var createGame = require('voxel-engine')
var voxel = require('voxel')
var toolbar = require('toolbar')
var player = require('voxel-player')
var presetSelector = toolbar({el: '#tools'})

var game = window.game = createGame({
  generate: voxel.generator.Valley,
  chunkDistance: 2,
  materials: [
    ['grass', 'dirt', 'grass_dirt'],
    'grass'
  ],
  texturePath: 'textures/',
  worldOrigin: [0, 0, 0],
  controls: { discreteFire: true }
})

// Load voxel-pp, then voxel-colorist
var composer = require('voxel-pp')(game)
var colorist = require('../')(composer)

// Change presets using the toolbar
presetSelector.on('select', function(material) {
  colorist.table('colors/' + material + '.png')
})

// Take screenshots with the tilde (~) key
// Using SHIFT+~ will take an unprocessed image
var image
window.addEventListener('keydown', function(e) {
  if (e.keyCode !== 192) return
  if (image) document.body.removeChild(image)
  image = colorist.snapshot(e.shiftKey)

  image.style.width = '300px'
  image.style.height = 'auto'
  image.style.position = 'absolute'
  image.style.top = '10px'
  image.style.left = '10px'
  image.style.border = '5px solid rgba(50, 50, 50, 0.8)'
  image.style.zIndex = 999
  image.style.opacity = 0.9

  document.body.appendChild(image)
})

// Drag/drop images onto the game to load
// a new palette
document.body.ondragover = function(e) {
  return e.preventDefault() && false
}
document.body.ondrop = function(e) {
  e.preventDefault()
  e.stopPropagation()

  if (!e.dataTransfer) return false

  var file = e.dataTransfer.files[0]

  if (!file) return false
  if (!file.type.match(/image/)) return false

  var reader = new FileReader
  reader.onload = function(e) {
    colorist.table(e.target.result)
  };
  reader.readAsDataURL(file)
  return false;
}

var container = document.querySelector('#container')

game.appendTo(container)

// create the player from a minecraft skin file and tell the
// game to use it as the main player
var createPlayer = player(game)
var substack = createPlayer('substack.png')
substack.possess()
substack.yaw.position.set(2, 14, 4)

// toggle between first and third person modes
window.addEventListener('keydown', function (ev) {
  if (ev.keyCode === 'R'.charCodeAt(0)) substack.toggle()
})

game.on('fire', function(target, state) {
  var point = game.raycast()
  if (!point) return
  var erase = !state.firealt && !state.alt
  if (erase) {
    game.setBlock(point.position, 0)
  } else {
    game.createAdjacent(point, currentMaterial)
  }
})
