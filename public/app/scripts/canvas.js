var canvasDiv = $('#canvas'),
    clearButton = $('#clearButton'),
    colorList = $('#colors'),
    rainbow = $('.rainbow'),
    colorpicker = $('#colorpicker'),
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight,
    strokeWidth = 5,
    clickX = [],
    clickY = [],
    clickDrag = [],
    paint,
    colors = {
      "black": "#000",
      "purple": "#7B1FA2",
      "teal": "#009688",
      "amber": "#FFA000",
      "grey": "#616161",
      "orange": "#FF5722",
      "yellow": "#FFEB3B",
      "green": "#388E3C",
      "blue": "#2196F3",
      "red": "#FF5252",
      "pink": "#C2185B",
      "indigo": "#303F9F",
      "white": "#fff",
      "brown": "#795548"
    },
    currentColor = colors.black,
    socket = io.connect("http://localhost:9000");

function setCanvas () {
  canvas = document.createElement('canvas');
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);
  canvas.setAttribute('id', 'canvas');
  canvasDiv.append(canvas);

  if(typeof G_vmlCanvasManager != 'undefined') {
    canvas = G_vmlCanvasManager.initElement(canvas);
  }

  context = canvas.getContext("2d");
}

// When you click and drag over the canvas
$('#canvas').mousedown(function (e) {
  var mouseX = e.pageX - this.offsetLeft,
      mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false);
  redraw();
});

var lastEmit = $.now();

// When you move the cursor over the canvas
$('#canvas').mousemove(function (e) {
  socket.emit('mousemove',{
              'x': e.pageX,
              'y': e.pageY,
              'drawing': paint
          });
          lastEmit = $.now();
  if (paint) {
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});



// When the cursor is off the canvas
$('#canvas').mouseup(function (e) {
  paint = false;
});

// The moment the cursor goes off, stop printing
$('#canvas').mouseleave(function (e) {
  paint = false;
});

// Save the click pos
function addClick (x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function reset () {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Define canvas attributes
function redraw () {

  for (var i = 0; i < clickX.length; i++) {
    context.beginPath();
    if (clickDrag[i] && i) {
      context.moveTo(clickX[i-1], clickY[i-1]);
    } else {
      context.moveTo(clickX[i]-1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);

    context.closePath();
  }

  context.lineJoin = "round";
  context.lineWidth = strokeWidth;
  context.strokeStyle = currentColor;
  context.stroke();

}

// List of colors
function createColorList () {
  for(color in colors) {
    colorList.append('<li><button style="background: ' + colors[color] + '" class="' + color + '" onclick="currentColor = colors.' + color + '; $(' + "'" + '#tap.noUi-connect' + "'" + ').css({' + "'" + 'background' + "'" + ': currentColor});"></button></li>');
  }
}

// On document resize, change width and height vars
$( window ).resize(function() {
  $('#canvas').attr({width:window.innerWidth,height:window.innerHeight});
});

function colorPickerLoad() {
  // Color picker
  var resultElement = $('.result'),
  	sliders = $('.sliders');

  function setColor(){

  	// Get the slider values,
  	// stick them together.
  	currentColor = 'rgb(' +
  		parseInt(sliders[0].noUiSlider.get()) + ',' +
  		parseInt(sliders[1].noUiSlider.get()) + ',' +
  		parseInt(sliders[2].noUiSlider.get()) + ')';

  	// Fill the color box.
  	$('.result').css({"background": currentColor});
    $('#tap.noUi-connect').css({"background": currentColor});
  }
  for (var i = 0; i < sliders.length; i++) {
  	noUiSlider.create(sliders[i], {
  		start: 127,
  		connect: "lower",
  		orientation: "vertical",
  		range: {
  			'min': 0,
  			'max': 255
  		}
  	});
  	// Bind the color changing function
  	sliders[i].noUiSlider.on('slide', setColor);
  }

  tapSlider = document.getElementById('tap');

  noUiSlider.create(tapSlider, {
  	start: 5,
  	behaviour: 'snap',
    connect: 'lower',
  	range: {
  		'min':  1,
  		'max':  30
  	}
  });

  tapSlider.noUiSlider.on('update', function( values, handle ) {

  	var value = values[handle];
    strokeWidth = value;

  });
}


  setCanvas();
  createColorList();
  colorPickerLoad();



// Button click events
clearButton.click(function (e) {
  if (confirm('Are you sure you want clear the canvas?')) {
      reset();
  }
});
rainbow.click(function (e) {
  colorpicker.fadeToggle();
});
