var createGame = require('voxel-engine')
var voxel = require('voxel')
var toolbar = require('toolbar')
var skin = require('minecraft-skin')
var debris = require('voxel-debris')
var presetSelector = toolbar({el: '#tools'})

var game = window.game = createGame({
  generate: voxel.generator['Valley'],
  startingPosition: [185, 300, 0],
  texturePath: 'textures/',
  materials: [['grass', 'dirt', 'grass_dirt']],
  skyColor: 0xffffff,
  fogScale: 0.8
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

// Set up the game
var container = document.querySelector('#container')

game.appendTo(container)

container.addEventListener('click', function() {
  game.requestPointerLock(container)
})

// Characters
game.controls.yawObject.rotation.y = 1.5

var maxogden = skin(game.THREE, 'maxogden.png').createPlayerObject()
maxogden.position.set(0, 62, 20)
game.scene.add(maxogden)

var substack = skin(game.THREE, 'substack.png').createPlayerObject()
substack.position.set(0, 62, -20)
game.scene.add(substack)

// Create/explode voxels on click.
var explode = debris(game, { power : 1.5, yield: 1 })
game.on('mousedown', function (pos) {
  if (erase) explode(pos)
  else game.createBlock(pos, 1)
})

var erase = true
window.addEventListener('keydown', function (ev) {
  if (ev.keyCode === 'X'.charCodeAt(0)) {
    erase = !erase
  }
})

function ctrlToggle (ev) { erase = !ev.ctrlKey }
window.addEventListener('keyup', ctrlToggle)
window.addEventListener('keydown', ctrlToggle)

module.exports = game
