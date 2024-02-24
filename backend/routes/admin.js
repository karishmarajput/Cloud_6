const express = require("express");
const router = express.Router();
const multer = require("multer")
const AdminController = require("../controllers/AdminController")
const checkAuth = require("../middlewares/checkauth");
const upload = multer({dest : 'public/files'});
router.post("/signup",AdminController.signup)
router.post("/login",AdminController.login);
router.get("/home",checkAuth,AdminController.getUnverifiedOrganizations);
router.get("/organisation",checkAuth,AdminController.getVerifiedOrganizations);
router.post("/deleteOrganization/:organizationId",checkAuth,AdminController.deleteOrganization);
router.post("/verifyUser/:organizationId",checkAuth,AdminController.verifyOrganization);
router.post("/getuserdetails",AdminController.GetDetails);
router.get("/analytics",AdminController.Analytics)

module.exports = router;