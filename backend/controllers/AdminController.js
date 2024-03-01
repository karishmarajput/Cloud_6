const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const PDFServicesSdk = require("@adobe/pdfservices-node-sdk");
const { v4: uuidv4 } = require("uuid");
const zip = require("adm-zip");
const nodemailer = require("nodemailer");
const util = require("util");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");
const Admin = require("../models/AdminModel");
const Organization = require("../models/OrganizationModel");
const User = require("../models/UserData");

const templatesDirectory = path.join(__dirname, '..', 'templates/');

const {sendVerificationEmail,deserializeWithDelimiter,createPDF} = require("../utils/utils");
exports.signup = async(req,res,next) => { 
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message : "Please fill all the fields"});
        }
        let admin = await Admin.findOne({email : email});
        if (admin){
            return res.status(400).json({message : "User already exists"})
        }
        admin = new Admin({
            _id: new mongoose.Types.ObjectId(),
            email : email,
            password : password
        })
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password,salt);
        await admin.save()
        .then((saved,err)=>{
            if (saved){
                return res.status(200).json({message : "Admin Created"})
            }
            if (err){
                return res.status(400).json({message : "Admin could not be created"})
            }
        })
    } catch (error) {
        res.status(500).json({message : "Error while signing up the admin"})
    }
}

exports.login = async(req,res,next) => {
    const {email,password} = req.body;
    try {
        let admin = await Admin.findOne({email : email});
        if (!admin){
            return res.status(400).json({message : "Admin doesn't exist"});
        }
        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.status(400).json({message : "Incorrect password"});
        }
        const payload = {admin : {id : admin._id}}
        jwt.sign(payload,process.env.JWT_KEY,{expiresIn : 3600},(err,token)=>{
            if (err) throw err;
            res.status(200).json({isAdmin: true,token : token})
        })
    } catch (error) {
        res.status(500).json({messsage : "Server error"})
    }
}
exports.getUnverifiedOrganizations = async(req,res,next) =>{
    let data = await Organization.find({ isVerified: false });
    const data_mapped = data.map(obj => {
        const { _id, name } = obj;
        return { _id, name };
      });
    if (data){
        return res.status(200).json({data})
    }
    else{
        return res.status(400).json({message : "Could not fetch the data"})
    }
}

exports.getVerifiedOrganizations = async(req,res,next) =>{
    let data = await Organization.find({ isVerified: true });
    const data_mapped = data.map(obj => {
        const { _id, name } = obj;
        return { _id, name };
      });
    if (data){
        return res.status(200).json({data})
    }
    else{
        return res.status(400).json({message : "Could not fetch the data"})
    }
}



exports.verifyOrganization = async(req,res,next) => {
    const organizationId = req.params.organizationId;
    try {
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        organization.isVerified = true;
        await organization.save()
        .then((result,err) => {
            if(result){
                sendVerificationEmail(organization)
                return res.status(200).json({ message: 'Verification status changed successfully' });
            }
            else{
                return res.status(400).json({message : "Could not verify the organization"})
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
exports.deleteOrganization = async (req, res, next) => {
    const organizationId = req.params.organizationId;
    try {
      const organization = await Organization.findByIdAndDelete(organizationId);
      if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
      }
  
      res.status(200).json({ message: 'Organization deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting organization', error: error.message });
    }
};
exports.GetDetails = async (req, res) => {
    const userPresent = await User.findOne({ email: req.body.email });

    if (!userPresent) {
        return res.status(400).json({ message: "User not present" });
    }

    const processItem = async (item) => {
        const [templateId, objectArray] = deserializeWithDelimiter(item.data, "#");
        const fileName = await createPDF(templatesDirectory + templateId, objectArray, templateId);
        return fileName;
    };

    try {
        const fileNames = await Promise.all(userPresent.totaldata.map(processItem));
        var zipper = new zip();
        for (var i = 0 ;i < fileNames.length;i++){
            zipper.addLocalFile(fileNames[i])
        }
        const uniqueZipID = uuidv4();
        const zipFileName = "zipped_files/" + uniqueZipID + ".zip";
        zipper.writeZip(zipFileName);

        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'Your certificate from Verifier',
            attachments: [{
                filename: zipFileName,
                path: zipFileName
            }],
        };

        const sendMail = util.promisify(transporter.sendMail).bind(transporter);
        await sendMail(mailOptions);

        res.json(userPresent.totaldata);
    } catch (error) {
        console.error('Error processing and sending certificates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.Analytics = async (req, res) => {
  try {
    const organizationCount = await Organization.countDocuments();
    console.log(organizationCount);
    let templateCount = 0;
    const organizations = await Organization.find();
    organizations.forEach((org) => {
      templateCount += org.templates.length;
    });
    res
      .status(200)
      .json({ orgCount: organizationCount, templateCount: templateCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
