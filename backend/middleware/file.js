const multer = require('multer');


const MIME_TYPE_MAP =
{
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("rreq file middle ware", req);
    // console.log("rreq file middle ware", JSON.parse(req));
    //console.log("rreq file middle ware", Object.keys(req.body));
    //console.log("rreq file middle ware", Object.values(req.body));
    //console.log("rreq file middle ware", req.body.image);

    // let p = Object.entries(req)
    // console.log("rreq file middle ware 2"+ p)
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Extension");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '-' + ext);
  }
});

/*
module.exports = () => {
  multer({ storage: storage }).single('image');
  multer({ storage: storage }).single('image1');
  multer({ storage: storage }).single('image2');
  return;
}*/
 module.exports = multer({storage: storage}).single('image');
// module.exports = multer({storage: storage}).array('image',3);
/*to upload multiple images
app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})
*/
