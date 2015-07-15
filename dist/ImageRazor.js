(function(window, fabric) {

  "use strict";


/* ImageRazor main */

// Base function.
var ImageRazor = function (options) {
  if (!this || this.toString() != '[object Object]') {
    return new ImageRazor(options);
  }

  this.init(options);
};



ImageRazor.prototype.init = function(options) {
  options = options || options;

  // define object properties

  




  console.log('hello world');

};


// Version.
ImageRazor.VERSION = '0.0.1';


// Export to the `window`.
window.ImageRazor = ImageRazor;

}(window, fabric));
