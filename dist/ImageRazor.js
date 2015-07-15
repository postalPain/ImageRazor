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
  var _this = this;

  this.canvasAddImage(function() {
    _this.canvasAddCropArea();
  });

}

// set image to canvas
ImageRazor.prototype.canvasAddImage = function(callback) {
  var _this = this;
  // set image element
  this.canvasElements.image = new fabric.Image.fromURL(this.options.src, function(oImg) {
    _this.canvas.add(oImg);

    var imgSize = _this.calcImageSize(oImg.width, oImg.height);
    oImg.setWidth(imgSize.width).setHeight(imgSize.height).center().setCoords().moveTo(-1);
    oImg.evented = false;


    _this.canvasElements.image = oImg;

    callback();
  });





}

// set cropping area to canvas
ImageRazor.prototype.canvasAddCropArea = function() {
  var rect = new fabric.cropArea({
    width: 200,
    height: 200,
    fill: 'green',
    borderColor: 'red',
    cornerColor: 'red',
    restrict: this.getRestrictCropArea()
  });

  this.canvas.add(rect);
  rect.center().setCoords();
  rect.setControlsVisibility({
    mtr: false
  });



  this.canvasElements.cropArea = rect;
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


ImageRazor.prototype.getRestrictCropArea = function() {

  return {
    x1: this.canvasElements.image.left,
    y1: this.canvasElements.image.top,
    x2: this.canvasElements.image.left + this.canvasElements.image.width,
    y2: this.canvasElements.image.top + this.canvasElements.image.height
  }
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


// Create new fabric object
fabric.cropArea = fabric.util.createClass(fabric.Rect, {
  initialize: function(options) {
    options.fill = 'rgba(0,0,0,0)';
    this.callSuper('initialize', options);

    var restrict = options.restrict;

    if (restrict) {
      this.on('moving', function() {

        var x1 = this.getLeft(),
          y1 = this.getTop(),
          x2 = x1 + this.getWidth(),
          y2 = y1 + this.getHeight();

        if (x1 < restrict.x1) {
          this.setLeft(restrict.x1);
        }

        if (y1 < restrict.y1) {
          this.setTop(restrict.y1);
        }

        if (x2 > restrict.x2) {
          this.setLeft(restrict.x2 - this.getWidth());
        }

        if (y2 > restrict.y2) {
          this.setTop(restrict.y2 - this.getHeight());
        }
      });

      this.on('scaling', function() {

        var x1 = this.getLeft(),
          y1 = this.getTop(),
          x2 = x1 + this.getWidth(),
          y2 = y1 + this.getHeight();


        this.width = Math.round(this.width * this.scaleX);
        this.height = Math.round(this.height * this.scaleY);
        this.scaleX = 1;
        this.scaleY = 1;




        if (x1 < restrict.x1) {
          var deltaX = restrict.x1 - x1;

          this.setLeft(restrict.x1);
          this.setWidth(this.width - deltaX);
        }

        if (y1 < restrict.y1) {
          var deltaY = restrict.y1 - y1;

          this.setTop(restrict.y1);
          this.setHeight(this.height - deltaY);
        }

        if (x2 > restrict.x2) {
          var deltaX = x2 - restrict.x2;

          this.setWidth(this.width - deltaX);
        }

        if (y2 > restrict.y2) {
          var deltaY = y2 - restrict.y2;

          this.setHeight(this.height - deltaY);
        }
      });
    }


  },
  _render: function(ctx) {
    // render inherited object
    this.callSuper('_render', ctx);

    var coordOffsetLeft = Math.ceil(this.left + this.width / 2) * -1,
        coordOffsetTop =  Math.ceil(this.top + this.height / 2) * -1;


    ctx.save();
    ctx.translate(coordOffsetLeft, coordOffsetTop);

    // dark shadow
    //
    //    x1    x2    x3    x4
    // y1 +-----+-----+------+
    //    |\\\\\\\\\\\\\\\\\\|
    //    |\\\\\\\\\\\\\\\\\\|
    // y2 +-----+-----+------+
    //    |\\\\\|     |\\\\\\|
    //    |\\\\\|     |\\\\\\|
    // y3 +-----+-----+------+
    //    |\\\\\\\\\\\\\\\\\\|
    //    |\\\\\\\\\\\\\\\\\\|
    // y4 +-----+-----+------+

    var x1 = 0,
        x2 = this.left,
        x3 = this.left + this.width,
        x4 = this.canvas.width,
        y1 = 0,
        y2 = this.top,
        y3 = this.top + this.height,
        y4 = this.canvas.height;


    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

    // Upper rect
    ctx.fillRect(x1, y1, x4, y2);

    // Bottom rect
    ctx.fillRect(x1, y3, x4, y4-y3);

    // Left rect
    ctx.fillRect(x1, y2, x2-x1, y3-y2);


    // Right rect
    ctx.fillRect(x3, y2, x4-x3, y3-y2);


    ctx.restore();
  }
});



// Version.
ImageRazor.VERSION = '0.0.1';


// Export to the `window`.
window.ImageRazor = ImageRazor;

}(window, document, fabric));
