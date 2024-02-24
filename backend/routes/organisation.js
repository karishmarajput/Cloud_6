const express = require("express");
const router = express.Router();
const OrganizationController = require("../controllers/OrganizationController")
const checkAuth = require("../middlewares/checkauth");
const upload = require("../middlewares/upload")
const csvupload = require("../middlewares/upload_csv")
router.post("/signup",OrganizationController.signup)
router.post("/login",OrganizationController.login);
//checkAuth
router.post("/uploadtemplate",checkAuth,upload.single("myFile"),OrganizationController.uploadTemplate)
router.get("/gettemplates",checkAuth,OrganizationController.getMyTemplates)
//checkAuth 
router.post("/csvandtemplate",csvupload.single("csvfile"),OrganizationController.uploadCSVandSelectTemplate)
router.delete("/deletetemplate/:templateID",checkAuth,OrganizationController.deleteTemplate);
router.get("/profile",checkAuth,OrganizationController.getInfo)
module.exports = router;