/**
 * 使用spritesmith生成sprite.png
 */
const Spritesmith = require('spritesmith');
const fs = require('fs')
const path = require('path')

// Generate our spritesheet
var sprites = ['./src/images/box1.png', './src/images/box2.png'];
Spritesmith.run({ src: sprites }, function handleResult(err, result) {
    console.log(result)
    fs.writeFileSync(path.join(__dirname, './dist/sprite.png'), result.image)
    // result.image; // Buffer representation of image
    // result.coordinates; // Object mapping filename to {x, y, width, height} of image
    // result.properties; // Object with metadata about spritesheet {width, height}
});