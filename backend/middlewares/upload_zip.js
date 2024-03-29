const multer = require("multer")
const path = require("path")
const {v4 : uuidv4} = require("uuid");
const pdfstorage = multer.diskStorage({
  destination : 'zip_upload',
  filename : (req,file,cb) => {
      cb(null,file.fieldname + '_' + Date.now() + uuidv4() +  path.extname(file.originalname))
  }
})
const pdfUpload = multer({
  storage : pdfstorage,
  limits : {
      fileSize : 10000000
  },
  fileFilter (req,file,cb){
      if(!file.originalname.match(/\.(zip)$/))
      {
          return cb(new Error('Please upload a zip file'))
      }
      cb(undefined,true)
  }
})
module.exports = pdfUpload