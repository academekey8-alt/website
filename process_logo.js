const { Jimp } = require("jimp");

async function processImage() {
  try {
    const image = await Jimp.read("assets/img/logo.png");
    
    // Autocrop the image to remove empty white borders
    image.autocrop({ tolerance: 0.1 });
    
    // Scan and replace white-ish pixels with transparent ones
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // If it's very close to white, make it transparent
      if (r > 245 && g > 245 && b > 245) {
        this.bitmap.data[idx + 3] = 0; 
      }
    });
    
    await image.write("assets/img/logo.png");
    console.log("Logo successfully cropped and background removed!");
  } catch(e) {
    console.error(e);
  }
}

processImage();
