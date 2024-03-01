const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const {v4 : uuidv4} = require("uuid")
const zip = require("adm-zip")
const nodemailer = require("nodemailer");
const util = require("util")
const jwt = require("jsonwebtoken")
require("dotenv").config();

const Admin = require("../models/AdminModel");
const Organization = require("../models/OrganizationModel");
const User = require("../models/UserData");

exports.signup = async(req,res,next) => { 
    const {email,password} = req.body;
    try {
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

async function sendVerificationEmail(organization) {
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: organization.email,
      subject: 'Organization Verification',
      text: 'Your organization has been successfully verified by Admin.'
    };
    let attempt = 1;
    while (attempt <= 5) {
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return;
      } catch (error) {
        console.error(`Error sending email (attempt ${attempt}):`, error);
        attempt++;
      }
    }
    console.error('Email could not be sent after 5 attempts.');
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
  function deserializeWithDelimiter(dataString, delimiter) {
    const dataArray = dataString.split(delimiter);
    const templateId = dataArray.pop();
    const objectsArray = dataArray.map(jsonString => JSON.parse(jsonString));
    return  [templateId, objectsArray];
}
async function createPDF(file_path,data_instance,template_id){
    try {
        const credentials = PDFServicesSdk.Credentials
            .servicePrincipalCredentialsBuilder()
            .withClientId("c69f66aa60dd4a718f84e509a8e5077a")
            .withClientSecret("p8e-Evegkfh66jnyj6FCqHB2S1VHgjcz8bB7")
            .build();
        const jsonDataForMerge = data_instance[0];
        const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
        const documentMerge = PDFServicesSdk.DocumentMerge;
        const documentMergeOptions = documentMerge.options;
        const options = new documentMergeOptions.DocumentMergeOptions(jsonDataForMerge, documentMergeOptions.OutputFormat.PDF);
        const documentMergeOperation = documentMerge.Operation.createNew(options);
        const input = PDFServicesSdk.FileRef.createFromLocalFile(file_path);
        documentMergeOperation.setInput(input);
        const result = await documentMergeOperation.execute(executionContext);
        const uniqueFileName = `Marksheet_${uuidv4()}.pdf`;
        await result.saveAsFile('backend/emailbuf/'+uniqueFileName)
        .then((result) =>{})
        return 'backend/emailbuf/'+uniqueFileName
    } catch (error) {
        console.log('Exception encountered while executing operation', error);
    }
}
const path = require('path');

const templatesDirectory = path.join(__dirname, '..', 'templates/');
exports.GetDetails = async(req,res) => {
    const UserPresent = await User.findOne({email : req.body.email});
    console.log(UserPresent)
    if (!UserPresent){
        return res.status(400).json({message : "User not present"})
    }
    else{
        const file_names = []
        const data = UserPresent.totaldata;
        for (var i = 0;i < data.length;i++){
            const [template_id,ObjectArray] = deserializeWithDelimiter(data[i].data,"#");
            const file_name = await createPDF(templatesDirectory+template_id,ObjectArray,template_id)
            file_names.push(file_name);
            console.log(file_names)
        }
        var zipper = new zip();

        for (var i = 0 ;i < file_names.length;i++){
            zipper.addLocalFile(file_names[i])
        }
        const uniqueZipID = uuidv4();
        zipper.writeZip("zipped_files/"+uniqueZipID +".zip");
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user:  process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        const mailOptions = {
            from:  process.env.EMAIL,
            to: req.body.email,
            subject: 'Your certificate from Verifier',
            attachments: [{
                filename: 'zipped_files/'+uniqueZipID + '.zip',
                path: 'zipped_files/'+uniqueZipID + '.zip'
            }],
        };
        const sendMail = util.promisify(transporter.sendMail).bind(transporter);
        const info = await sendMail(mailOptions);
        
        
        res.json(UserPresent.totaldata)
    }
}
exports.Analytics = async (req, res) => {
    try {
        const organizationCount = await Organization.countDocuments({ isVerified: true });

      console.log(organizationCount)
      let templateCount = 0;
      const organizations = await Organization.find();
      organizations.forEach(org => {templateCount += org.templates.length;});
      res.status(200).json({orgCount : organizationCount,templateCount : templateCount});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};