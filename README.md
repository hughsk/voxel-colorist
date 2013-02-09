# voxel-colorist #

A module for colour grading your voxels in [voxel.js](http://voxeljs.com), for
use with [voxel-pp](http://github.com/hughsk/voxel-pp).

[Check out the demo here](http://hughsk.github.com/voxel-colorist/demo)

This is done using a 3D colour lookup table (as detailed
[here](http://youtu.be/rfQ8rKGTVlg?t=24m31s)
and [here](http://http.developer.nvidia.com/GPUGems2/gpugems2_chapter24.html)),
which is surprisingly simple and easy to work with.
[The Witness Blog](http://the-witness.net/news/2012/08/fun-with-in-engine-color-grading/) has a good explanation too.

![voxel-colorist](https://raw.github.com/hughsk/voxel-colorist/master/screenshot.jpg)

## Installation ##

``` bash
npm install voxel-colorist voxel-pp
```

## Usage ##

**`colorist(processor)`**

Creates a new colour-grader instance.

**`colorist(processor).table(src|element|texture)`**

Loads a new colour table from a canvas/image element or image URL.

``` javascript
// Create the game
var game = require('voxel-engine')({
  chunkSize: 32
})

// Load up post-processing
var composer = require('voxel-pp')(game)
// Add colour grading
var colorist = require('voxel-colorist')(composer)

// Load a 32*32*32 colour table
var img = new Image
img.onload = function() {
  colorist.table(img)
};
img.src = '/warm.png'
```



