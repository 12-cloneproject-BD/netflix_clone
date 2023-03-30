const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filenameImage: function (req, file, cb) {
        
        cb(null, file.originalname + '.png');
    },
    filenameVideo : function (req, file, cb) {
        
        cb(null, file.originalname + '.mp4');
    },
});
const upload = multer({ storage: storage });
 module.exports = { upload };
