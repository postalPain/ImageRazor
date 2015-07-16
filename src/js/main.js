/* ImageRazor main */

// Base function.
var ImageRazor = function (options) {
  if (!this || this.toString() != '[object Object]') {
    return new ImageRazor(options);
  }

  options = options || options;
  options.wrapper = typeof options.wrapper == 'string' ? document.querySelector(options.wrapper) : options.wrapper;

  // define default options
  var defaults = {
    imageSize: 'asItIs',
    editor: {
      width: 400,
      height: 300,
      backgroundColor: '#000',
      cropAreaBorderColor: '#A5A5A5',
      cropAreaBorderWidth: 1,
      cropAreaBorderDashStep: 7,
      cropAreaSize: {
        width: 200,
        height: 200
      }
    },
    saveCallback: function(){}
  };

  options.editor = options.editor || {};
  options.editor = extend(options.editor, defaults.editor);
  this.options = extend(options, defaults);

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
    backgroundColor: this.options.editor.backgroundColor
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
    var imgSize;
    _this.canvas.add(oImg);
    _this.srcImageSize = {
      width: oImg.width,
      height: oImg.height
    };

    imgSize = _this.calcImageSize(oImg.width, oImg.height);
    oImg.setWidth(imgSize.width).setHeight(imgSize.height).center().setCoords().moveTo(-1);
    oImg.evented = false;


    _this.canvasElements.image = oImg;

    callback();
  }, {crossOrigin: true});





}

// set cropping area to canvas
ImageRazor.prototype.canvasAddCropArea = function() {
  var rect,
    generalSettings = {
      borderColor: this.options.editor.cropAreaBorderColor,
      cornerColor: this.options.editor.cropAreaBorderColor,
      borderDashStep: this.options.editor.cropAreaBorderDashStep,
      borderWidth: this.options.editor.cropAreaBorderWidth,
      restrict: this.getRestrictCropArea()
    },
    settings;

  // check if we want image with specific size
  if (typeof this.options.imageSize == 'object') {
    var cropArea = this.calcCropAreaSize();

    settings = {
      width: cropArea.width,
      height: cropArea.height,
      hasControls: false
    }
  } else {
    settings = {
      width: this.options.editor.cropAreaSize.width,
      height: this.options.editor.cropAreaSize.height
    }
  }

  settings = extend(settings, generalSettings);

  rect = new fabric.cropArea(settings);

  this.canvas.add(rect);
  rect.center().setCoords();
  rect.setControlsVisibility({
    mtr: false
  });



  this.canvasElements.cropArea = rect;
}


ImageRazor.prototype.calcCropAreaSize = function() {
  var width,
      height;

  if (this.canvasElements.image.width != this.canvas.width) {
    width = this.canvasElements.image.width;
    height = Math.round((this.options.imageSize.height / this.options.imageSize.width) * width);
  } else {
    height = this.canvasElements.image.height;
    width = Math.round((this.options.imageSize.width / this.options.imageSize.height) * height);
  }

  return {
    width: width,
    height: height
  }
}


ImageRazor.prototype.saveToDataURL = function() {
  var multiplier,
      data;

  // set multiplier
  if (typeof this.options.imageSize == 'object') {
    multiplier = this.options.imageSize.width/this.canvasElements.image.width;
  } else if (this.options.imageSize == 'original') {
    multiplier = this.srcImageSize.width/this.canvasElements.image.width;
  } else {
    multiplier = 1;
  }

  // hide crop area
  this.canvasElements.cropArea.hide();

  data = this.canvas.toDataURL({
        left: this.canvasElements.cropArea.left,
        top: this.canvasElements.cropArea.top,
        width: this.canvasElements.cropArea.width,
        height: this.canvasElements.cropArea.height,
        multiplier: multiplier
      });

  // restore crop area
  this.canvasElements.cropArea.show();

  this.options.saveCallback(data);
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
    options.hasBorders = false;
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


    // draw borders
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = this.borderWidth;

    ctx.beginPath();
    this.drawDashLine(x2, y2, x2, y3, ctx);
    this.drawDashLine(x2, y3, x3, y3, ctx);
    this.drawDashLine(x3, y3, x3, y2, ctx);
    this.drawDashLine(x3, y2, x2, y2, ctx);
    ctx.stroke();


    ctx.restore();
  },

  hide: function() {
    this.set({
      opacity: 0,
      selectable: false
    });
  },

  show: function() {
    this.set({
      opacity: 1,
      selectable: true
    });
  },

  drawDashLine: function(x1, y1, x2, y2, ctx, dashLen) {
    if (dashLen == undefined) dashLen = this.borderDashStep;
    ctx.moveTo(x1, y1);

    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var q = 0;
    while (q++ < dashes) {
      x1 += dashX;
      y1 += dashY;
      ctx[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    ctx[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
  }



});
