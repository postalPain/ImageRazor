(function(window, document, fabric) {

  "use strict";


/* ImageRazor main */

// Base function.
var ImageRazor = function (options) {
  if (!this || this.toString() != '[object Object]') {
    return new ImageRazor(options);
  }

  options = options || options;
  options.wrapper = typeof options.wrapper == 'string' ? document.querySelector(options.wrapper) : options.wrapper;

  // define default options
  this.defaults = {
    image: {
      width: 400,
      height: 300
    },
    editor: {
      width: 400,
      height: 300
    },
    backgroundColor: '#000'
  };

  this.options = extend(options, this.defaults);

  // initialize editor
  this.init();
};



ImageRazor.prototype.init = function() {
  // Init DOM elements
  var wrapper = this.options.wrapper;

  // Create splashscreen element
  var editorSplashscreen = document.createElement('div');
  editorSplashscreen.className = 'image-razor-splashscreen';
  wrapper.appendChild(editorSplashscreen);


  // Create editor box
  var editorBox = document.createElement('div');
  editorBox.className = 'image-razor-box';
  wrapper.appendChild(editorBox);


  // Create toolbox
  var toolsBox = document.createElement('div');
  toolsBox.className = 'image-razor-toolbox';
  editorBox.appendChild(toolsBox);


  // Create canvas area
  var canvasElement = document.createElement('canvas');
  var canvasContainer = document.createElement('div');
  canvasContainer.className = 'image-razor-canvas-container';
  canvasContainer.appendChild(canvasElement);
  editorBox.appendChild(canvasContainer);


  // define Canvas
  this.canvas = new fabric.Canvas(canvasElement, {
    selection: false,
    width: this.options.editor.width,
    height: this.options.editor.height,
    backgroundColor: this.options.backgroundColor
  });

  this.canvasElements = {
    image: null,
    cropArea: null
  };


  // setup Canvas elements
  this.canvasAddElements();

};


// set starting position to canvas elements
ImageRazor.prototype.canvasAddElements = function() {

  this.canvasAddImage();
  this.canvasAddCropArea();
}

// set image to canvas
ImageRazor.prototype.canvasAddImage = function() {
  var _this = this;
  // set image element
  this.canvasElements.image = new fabric.Image.fromURL(this.options.src, function(oImg) {
    _this.canvas.add(oImg);

    var imgSize = _this.calcImageSize(oImg.width, oImg.height);
    oImg.setWidth(imgSize.width).setHeight(imgSize.height).center().setCoords();
    oImg.evented = false;



    _this.canvasElements.image = oImg;
  });





}

// set cropping area to canvas
ImageRazor.prototype.canvasAddCropArea = function() {

}


ImageRazor.prototype.calcImageSize = function(imgWidth, imgHeight) {
  var cWidth = this.canvas.width,
    cHeight = this.canvas.height,
    cRatio = cWidth/cHeight,
    imgRatio = imgHeight/imgWidth,
    newImgWidth,
    newImgHeight;

  if (cRatio <= 1 && imgRatio <= 1 || cRatio > 1 && imgRatio > 1) {
    newImgWidth = cWidth;
    newImgHeight = Math.round(newImgWidth * imgRatio);
  } else {
    newImgHeight = cHeight;
    newImgWidth = Math.round(newImgHeight / imgRatio);
  }


  return {
    width: newImgWidth,
    height:newImgHeight
  };
}



// Utility method to easily extend objects.
function extend(b, a) {
  var prop;
  if (b === undefined) {
    return a;
  }
  for (prop in a) {
    if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
      b[prop] = a[prop];
    }
  }
  return b;
}


// Version.
ImageRazor.VERSION = '0.0.1';


// Export to the `window`.
window.ImageRazor = ImageRazor;

}(window, document, fabric));
