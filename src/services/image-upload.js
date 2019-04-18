const multer = require('multer'); // Multer for file uploads
const aws = require('aws-sdk'); // Aws file uploading
const multerS3 = require('multer-s3'); // Multer for s3
const path = require('path');

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    acessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
});

var s3 = new aws.S3({});

function fileFilter(req, file, cb) {
    // Allowed extentions 
    const fileTypes = /jpeg|jpg|png|gif/;
    // check mime type
    const mimetype = fileTypes.test(file.mimetype);
    if(mimetype) {
        return cb(null, true)
    } else {
        cb(new Error('Invalid Mime Type'), false);
    }
}

const upload = multer({
	fileFilter: fileFilter,
    storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, {fieldname: file.fieldname})
    },
    key: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now().toString())
    }
})
}).single('image');

module.exports = upload;