import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "./attachments/uploads/";
    if (file.mimetype === 'text/csv') {
      dest = "./attachments/csv/";
    }
    cb(null, dest)
  },
  filename: function (req, file, cb) {
    cb(null,  file.originalname)
  }
})

const fileFilter = (req: any, file:any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'text/csv') {
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


