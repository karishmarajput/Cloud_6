const multer = require("multer")
const path = require("path")
const {v4 : uuidv4} = require("uuid");
const csvstorage = multer.diskStorage({
  destination : 'csv_data',
  filename : (req,file,cb) => {
      cb(null,file.fieldname + '_' + Date.now() + uuidv4() +  path.extname(file.originalname))
  }
})
const csvUpload = multer({
  storage : csvstorage,
  limits : {
      fileSize : 10000000
  },
  fileFilter (req,file,cb){
      if(!file.originalname.match(/\.(csv)$/))
      {
          return cb(new Error('Please upload a csv file'))
      }
      cb(undefined,true)
  }
})
module.exports = csvUpload