const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfUpload = require("../middlewares/upload_pdf");
const zipUpload = require("../middlewares/upload_zip");
const VerificationController = require("../controllers/VerificationController");
router.post("/uploadpdf",pdfUpload.single("pdf"),VerificationController.UploadPDF);
router.post("/uploadzip",zipUpload.single("zip"),VerificationController.UploadZip);
module.exports = router