const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop();
        let filenameFunction = null;
        if (extension === 'png') {
            filenameFunction = filenameImage;
        } else if (extension === 'mp4') {
            filenameFunction = filenameVideo;
        }
        if (filenameFunction) {
            filenameFunction(req, file, cb);
        } else {
            cb(new Error('Unsupported file type'));
        }
    }
});

function filenameImage(req, file, cb) {
    cb(null, file.originalname);
}

function filenameVideo(req, file, cb) {
    cb(null, file.originalname);
}

module.exports = {
    upload: multer({ storage: storage })
};
