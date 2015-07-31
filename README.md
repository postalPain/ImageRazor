# ImageRazor

Image editor, based on FabricJS library. Main  

## About

A JavaScript library by Pavel Lapin.

See the [project homepage](http://postalPain.github.io/ImageRazor).

## Installation

Using Bower:

    bower install ImageRazor

Or grab the [source](https://github.com/postalPain/ImageRazor/dist).

## Usage

Basic usage is as follows:

    ImageRazor({
        wrapper: '#image-razor',
        src: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Benz-velo.jpg',
        saveCallback: function(data) {
          var preview = document.getElementById('image-preview');
          preview.src = data;
       }
    });

##### Options:
wrapper (required) 
    
    query selector of the DOM Element where to place editor

src (required)

    image source, could be 'url' or 'dataURL'
    
imageSize - the size of the result image
    
    /* Default value. Image will be cropped by manually-specified crop area without scaling, as it is. */
    imageSize = 'asItIs'; 
    
    /* image will be cropped by manually-specified crop area and scaled in proportion to original image */
    imageSize = 'original'; 
    
    /* image will be cropped by specified crop area and scaled to specified dimensions 
    imageSize = {
      width: 200,
      height: 150
    }
 
 format
 
    Resulting image format. Default is 'dataURL'. Possible to specify 'binary' format. 

saveCallback

    Callback function with resulting image data.
    
cancelCallback

    Callback function on reject editing image.

editor
    
    {
      width: 400, // width of editor
      height: 300, // height of editor
      backgroundColor: '#000', // background color of the canvas
      cropAreaBorderColor: '#A5A5A5', 
      cropAreaBorderWidth: 1,
      cropAreaBorderDashStep: 7,
      cropAreaSize: { // define initial crop area size (imageSize == 'asItIs' || 'original')
        width: 200,
        height: 200
      }
    }

## Contributing

We'll check out your contribution if you:

* Provide a comprehensive suite of tests for your fork.
* Have a clear and documented rationale for your changes.
* Package these up in a pull request.

We'll do our best to help you out with any contribution issues you may have.

## License

MIT. See `LICENSE.txt` in this directory.
