import multer from 'multer'

const storage = multer.diskStorage({
  destination: "./attachments/uploads/",
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString()) + '-' + file.originalname
  }
})

const fileFilter = (req: any, file:any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    return cb(null, true)
  } else {
    cb({message: 'File(s) uploaded is not a supported file format'}, false)
  }
}

export const multerUpload = multer({
  storage: storage,
  limits: {fileSize: 1024 * 1024},
  fileFilter: fileFilter,
}).array("myImage");


