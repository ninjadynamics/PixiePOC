// set up canvas and grid
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// set canvas size based on screen aspect ratio
if (screen.width > screen.height) {
  canvas.width = screen.width / 4;
  canvas.height = screen.width / 4;
} else {
  canvas.width = screen.width / 3;
  canvas.height = screen.width / 3;
}

// calculate size of each individual cell
var cellSize = canvas.width / 8;

// create grid of 8x8 squares
for (var i = 0; i < canvas.width; i += cellSize) {
  for (var j = 0; j < canvas.height; j += cellSize) {
    ctx.fillStyle = "black";
    ctx.fillRect(i, j, cellSize, cellSize);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.strokeRect(i, j, cellSize, cellSize);
  }
}

// create color palette
var colorPalette = [
    "black", "blue", "green", "darkcyan", "darkred", "darkmagenta", "orange", "lightgray",
    "darkgray", "dodgerblue", "lime", "cyan", "red", "magenta", "yellow", "white"
];

// set default color to red
var currentColor = "red";
var currentIndex = 12;

// 8x8 grid array
var piksee = [];
for (var i = 0; i < 8; i++) {
  piksee[i] = [];
  for (var j = 0; j < 8; j++) {
    piksee[i][j] = 0;
  }
}

// function to change color on click
function changeColor(event) {
  var color = event.target.style.backgroundColor;
  currentColor = color;
  currentIndex = colorPalette.indexOf(color);
}

// create color palette buttons
for (var i = 0; i < colorPalette.length; i++) {
  var button = document.createElement("button");
  button.style.backgroundColor = colorPalette[i];
  button.onclick = changeColor;
  document.getElementById("color-palette").appendChild(button);
}

// function to draw on canvas
function draw(event) {
  var x = event.clientX;
  var y = event.clientY;
  var canvasRect = canvas.getBoundingClientRect();
  x -= canvasRect.left;
  y -= canvasRect.top;
  x = Math.floor(x / cellSize);
  y = Math.floor(y / cellSize);
  
  if (event.button === 0) {
    ctx.fillStyle = currentColor;
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    piksee[y][x] = currentIndex;
  } else if (event.button === 2) {
    ctx.fillStyle = "black";
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    piksee[y][x] = 0;
  }
}

// function to encode grid array into bit array
function encode(grid) {
  var bitArray = [];
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[0].length; j++) {
      var value = grid[i][j];
      var binary = value.toString(2).padStart(4, "0");
      for (var k = 0; k < binary.length; k++) {
        bitArray.push(parseInt(binary[k]));
      }
    }
  }
  return bitArray;
}

// function to decode bit array into grid array
function decode(bitArray) {
  var grid = [];
  var index = 0;
  for (var i = 0; i < 8; i++) {
    grid[i] = [];
    for (var j = 0; j < 8; j++) {
      var value = 0;
      for (var k = 0; k < 4; k++) {
        value += bitArray[index++] * Math.pow(2, 3 - k);
      }
      grid[i][j] = value;
    }
  }
  return grid;
}

// function to encode a 256 bit array into a big number
function bitArrayToBigNumber(bits) {
    return BigInt('0b' + bits.join(""));
}

// function to dencode a big number into a 256 bit array
function bigNumberToBitArray(bigNum) {
    return bigNum.toString(2).padStart(256, '0');
}

// function to check if two objects are the same
function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function mint() {
  var grid = encode(piksee);
  return bitArrayToBigNumber(grid).toString().padStart(78, '0');
}

function load(bigNum) {
  bitArray = bigNumberToBitArray(bigNum);
  grid = decode(bitArray);
  var canvasRect = canvas.getBoundingClientRect();
  for (var y = 0; y < 8; y++) {    
    for (var x = 0; x < 8; x++) {      
      ctx.fillStyle = colorPalette[grid[y][x]];
      ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
      piksee[y][x] = grid[y][x];
    }
  }
}

document.getElementById("mint-button").addEventListener("click", function() {
  var tokenIndex = document.getElementById("token-index");
  tokenIndex.value = mint();
});

document.getElementById("load-button").addEventListener("click", function() {
  var tokenIndex = document.getElementById("token-index");
  load(bigNum = BigInt(tokenIndex.value));
});

document.getElementById("clear-button").addEventListener("click", function() {
  var tokenIndex = document.getElementById("token-index");
  load(bigNum = BigInt(0));
});

// disable right-click
document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
}, false);

// add event listeners for drawing
canvas.addEventListener("mousedown", draw);

// clear text area
document.getElementById("token-index").value = Number(0).toString().padStart(78, '0');;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Test
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function test() {    
    bitArray = encode(grid);
    bigNum = bitArrayToBigNumber(bitArray);
    
    bitArray2 = bigNumberToBitArray(bigNum);
    grid2 = decode(bitArray2);
    
    return isEqual(grid, grid2);
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *