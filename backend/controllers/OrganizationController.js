const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const csv = require("csv-parser");
const util = require("util");
const { resolve } = require("path");
const { Document } = require("docxyz");
const crypto = require("crypto");
const mammoth = require("mammoth");
const PDFServicesSdk = require("@adobe/pdfservices-node-sdk");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const ethers = require("ethers");
var convertapi = require("convertapi")("ozeDVGketrfbznX6");
require("dotenv").config();
const { convert } = require("html-to-image");

const Organization = require("../models/OrganizationModel");
const uploadFile = require("../middlewares/upload");
const User = require("../models/UserData");

const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const {
  abi,
} = require("../blockchain/artifacts/contracts/Certification.sol/Certification.json");
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractInstance = new ethers.Contract(contractAddress, abi, signer);

function getUnixTimestampForNextMonths(numMonths) {
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setMonth(currentDate.getMonth() + numMonths);
  const currentUnixTimestamp = Math.floor(currentDate.getTime() / 1000);
  const nextUnixTimestamp = Math.floor(nextDate.getTime() / 1000);
  return { currentUnixTimestamp, nextUnixTimestamp };
}
//Organization Signup
exports.signup = async (req, res, next) => {
  const { name, email, phoneNumber, password } = req.body;
  try {
    let org = await Organization.findOne({ email: email });
    if (org) {
      return res.status(400).json({ message: "Organization already exists" });
    }
    org = new Organization({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      isVerified: false,
    });
    const salt = await bcrypt.genSalt(10);
    org.password = await bcrypt.hash(password, salt);
    await org.save().then((saved, err) => {
      if (saved) {
        return res.status(200).json({
          message: "Organization Created. Wait for Admin verification",
        });
      }
      if (err) {
        return res.status(400).json({ message: "Could not save organization" });
      }
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Error while signing up the organization" });
  }
};

//Organization Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);
    let org = await Organization.findOne({ email: email });
    console.log(org);
    if (!org) {
      return res.status(400).json({ message: "Organization doesn't exist" });
    }
    if (!org.isVerified) {
      return res.status(401).json({ message: "Organization not yet verified" });
    }
    const isMatch = await bcrypt.compare(password, org.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const payload = {
      org: {
        id: org._id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_KEY,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ _id: org._id, name: org.name, token: token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "Server error" });
  }
};

//Get Templates of a particular organization
exports.getMyTemplates = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.userData.org.id);
    if (!org) {
      return res
        .status(400)
        .json({ message: "The organization doesn't exist" });
    }
    const templates = org.templates;
    console.log(`Templates fetched: ${templates}`);
    const templates_mapped = templates.map((obj) => {
      const { _id, name, publicBool } = obj;
      return { _id, name, publicBool };
    });
    return res.status(200).json({ data: templates_mapped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//See the public templates and his templates
/*exports.SeeAllTemplates = async(req,res,next) => {
    try {
        const org = await Organization.findById(req.userData.org.id);
        if(!org){
            return res.status(400).json({message : "The organization doesn't exist"});
        }
        const templates = org.templates;
        const templates_mapped = templates.map(obj => {
            const { _id, name } = obj;
            return { _id, name };
        });
        const templates_public = await 
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Server Error"})
    }
}*/

//Upload a template (Word)
// const cloudinary = require("cloudinary").v2
exports.uploadTemplate = async (req, res, next) => {
  try {
    const bool = req.body.publicBool;
    const org = await Organization.findById(req.userData.org.id);
    org.templates.push({ name: req.file.filename, publicBool: bool });
    console.log(org.templates);
    await org.save();

    const result = await convertapi.convert(
      "jpg",
      { File: "./templates/" + req.file.filename },
      "doc"
    );
    await result.saveFiles("./image_files");

    return res.status(200).json({ message: "File Uploaded Successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

exports.deleteTemplate = async (req, res, next) => {
  try {
    const templateID = req.params.templateID;
    console.log(templateID);
    const org = await Organization.findById(req.userData.org.id);
    const templateIndex = org.templates.findIndex(
      (template) => template._id.toString() === templateID
    );
    if (templateIndex === -1) {
      return res.status(404).json({ message: "Template not found." });
    }
    const filename = org.templates[templateIndex].name;
    org.templates.splice(templateIndex, 1);
    await org.save().then((result, err) => {
      if (result) {
        fs.unlinkSync("../backend/templates/" + filename);
        // fs.unlinkSync("../backend/image_files/"+filename);
        return res
          .status(200)
          .json({ message: "Template deleted successfully." });
      } else {
        return res.status(400).json({ messaage: "Could not delete the file" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: `Could not delete the template. ${err}`,
    });
  }
};
exports.getInfo = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.userData.org.id);
    return res
      .status(200)
      .json({ name: org.name, email: org.email, phoneNumber: org.phoneNumber });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};
//Get all the headers of the csv
exports.getAllTemplates = async (req, res, next) => {
  try {
    await Organization.findById(req.userData.org.id).then((org, err) => {
      if (org) {
        console.log(org);
        console.log(org.templates);
        return res.status(200).json([org.templates]);
      } else {
        return res
          .status(400)
          .json({ message: "Could not fetch the templates" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

function getAttributesFromCSV(filePath) {
  const attributes = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headers) => {
        attributes.push(...headers);
      })
      .on("end", () => {
        resolve(attributes);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
async function addDataToBlockChainWithExpiry(
  CertificateID,
  HashedValue,
  ExpiryTime
) {
  const res = await contractInstance.GenerateCertificate(
    CertificateID,
    HashedValue,
    ExpiryTime
  );
  return res;
}
async function addDataToBlockChainWithoutExpiry(CertificateID, HashedValue) {
  const res = await contractInstance.GenerateCertificateWithInfinity(
    CertificateID,
    HashedValue
  );
  return res;
}

function parseCSVtoJSON(csvFilePath, placeholders) {
  return new Promise((resolve, reject) => {
    const jsonArray = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        var temp = {};
        var keys = Object.keys(row);
        for (var i = 0; i < placeholders.length; i++) {
          if (placeholders[i].trim() === keys[0].trim()) {
            temp[placeholders[i]] = row[keys[0]];
          } else {
            temp[placeholders[i]] = row[placeholders[i]];
          }
        }
        var emailObject = { email: row["email"] };
        if (row.hasOwnProperty("expiry")) {
          var expiryObject = { expiry: row["expiry"] };
          jsonArray.push([temp, emailObject, expiryObject]);
        } else {
          jsonArray.push([temp, emailObject]);
        }
      })
      .on("end", () => {
        resolve(jsonArray);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

//Extracting text from docx file
async function extractTextFromDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw error;
  }
}

//Using regex to count the number of placeholders in the file
function countPlaceholdersInText(text) {
  const pattern = /{{.*?}}/g;
  const matches = text.match(pattern) || [];
  return matches.map((match) => match.replace(/{{|}}/g, "").trim());
}

//Calculate the PDF Hash
async function calculatePDFHash(filePath, salt) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", (error) => {
      reject(error);
    });

    fileStream.on("data", (data) => {
      hash.update(data);
    });

    fileStream.on("end", () => {
      // Adding salt to the hash
      hash.update(salt);

      const fileHash = hash.digest("hex");
      resolve(fileHash);
    });
  });
}

const salt = process.env.SALT;

//Serializing Data
function serializeWithDelimiter(array, delimiter) {
  return array.map((item) => JSON.stringify(item)).join(delimiter);
}

//Utility for saving the serialized data corresponding to the user
async function SaveUserData(data_instance, template_name) {
  console.log(`Data instance ${data_instance}`);
  const UserAvailable = await User.findOne({
    email: data_instance[1]["email"],
  });
  if (UserAvailable) {
    UserAvailable.totaldata.push({
      data: serializeWithDelimiter(data_instance, "#") + "#" + template_name,
    });
    const res = await UserAvailable.save();
    return res;
  } else {
    const NewUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: data_instance[1]["email"],
    });
    NewUser.totaldata.push({
      data: serializeWithDelimiter(data_instance, "#") + "#" + template_name,
    });
    const res = await NewUser.save();
    return res;
  }
}

async function mergeAndSendEmail(
  file_path,
  data_instance,
  template_name,
  email
) {
  try {
    console.log("Sending email message....");
    const credentials =
      PDFServicesSdk.Credentials.servicePrincipalCredentialsBuilder()
        .withClientId(process.env.ADB_CLIENT)
        .withClientSecret(process.env.ADB_SECRET)
        .build();

    const executionContext =
      PDFServicesSdk.ExecutionContext.create(credentials);

    const jsonDataForMerge = data_instance[0];
    const uniqueFileName = `Certificate_${uuidv4()}.pdf`;

    const documentMerge = PDFServicesSdk.DocumentMerge;
    const documentMergeOptions = documentMerge.options;
    const options = new documentMergeOptions.DocumentMergeOptions(
      jsonDataForMerge,
      documentMergeOptions.OutputFormat.PDF
    );
    const documentMergeOperation = documentMerge.Operation.createNew(options);
    const input = PDFServicesSdk.FileRef.createFromLocalFile(file_path);
    documentMergeOperation.setInput(input);
    const result = await documentMergeOperation
      .execute(executionContext)
      .then((result) => result.saveAsFile("./file_buffer/" + uniqueFileName))
      .then(async (result) => {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: email,
        });

        const mailOptions = {
          from: email.user,
          to: data_instance[1]["email"],
          subject: "Certificate",
          attachments: [
            {
              filename: "./file_buffer/" + uniqueFileName,
              path: "./file_buffer/" + uniqueFileName,
            },
          ],
        };

        const sendMail = util.promisify(transporter.sendMail).bind(transporter);
        const info = await sendMail(mailOptions);
        const hash = await calculatePDFHash(
          "./file_buffer/" + uniqueFileName,
          salt
        );

        const saved = await SaveUserData(data_instance, template_name);

        console.log(data_instance.length);
        if (data_instance.length === 3) {
          const res = await addDataToBlockChainWithExpiry(
            data_instance[0]["id"],
            hash,
            getUnixTimestampForNextMonths(data_instance[2]["expiry"])
              .nextUnixTimestamp
          );
        } else {
          const res = await addDataToBlockChainWithoutExpiry(
            data_instance[0]["id"],
            hash
          );
        }

        fs.unlinkSync("./file_buffer/" + uniqueFileName);
      })
      .catch((err) => {
        if (
          err instanceof PDFServicesSdk.Error.ServiceApiError ||
          err instanceof PDFServicesSdk.Error.ServiceUsageError
        ) {
          console.log(
            "Exception encountered while executing merging operation",
            err
          );
        } else {
          console.log(
            "Exception encountered while executing merging operation",
            err
          );
        }
      });
  } catch (err) {
    console.log("Exception encountered while sending email", err);
  }
}

function getAttributesFromCSV(filePath) {
  let attributes = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headers) => {
        resolve(headers);
        attributes.push(...headers);
      })
      .on("end", () => {
        resolve(attributes);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

//Utility for comparing the placeholders and attributes
function compareArraysIgnoringEmail(placeholderArray, attributeArray) {
  const cleanPlaceholder = placeholderArray
    .filter((attr) => attr !== "email")
    .filter((attr) => attr != "expiry")
    .map((attr) => attr.trim());
  const cleanAttribute = attributeArray
    .filter((attr) => attr !== "email")
    .filter((attr) => attr != "expiry")
    .map((attr) => attr.trim());
  const sortedPlaceholder = cleanPlaceholder.slice().sort();
  const sortedAttribute = cleanAttribute.slice().sort();
  const arraysAreEqual =
    JSON.stringify(sortedPlaceholder) === JSON.stringify(sortedAttribute);
  return arraysAreEqual;
}

let emailAccounts = [
  { user: "Cloud62024@outlook.com", pass: "Cloud@66" },
  { user: "aaryan22441@outlook.com", pass: "aaryan@22441" },
  { user: "Vinayak122333@outlook.com", pass: "vinayak@122333" },
  { user: "karishma1232024@outlook.com", pass: "karishma@1232024" },
];

function distributeRowsAmongEmails(rows, emailAccounts) {
  let rowsPerEmail = {};
  rows.forEach((row, index) => {
    const emailIndex = index % emailAccounts.length;
    const email = emailAccounts[emailIndex];
    if (!rowsPerEmail[email]) {
      rowsPerEmail[JSON.stringify(email)] = [];
    }
    rowsPerEmail[JSON.stringify(email)].push(row);
  });
  return rowsPerEmail;
}

async function processRowsWithParallelEmails(
  rows,
  emailAccounts,
  file_path,
  template_name
) {
  try {
    const rowsPerEmail = distributeRowsAmongEmails(rows, emailAccounts);
    console.log("Rows per email:");
    console.log(rowsPerEmail);
    await Promise.all(
      emailAccounts.map((email, index) => {
        const emailRows = rowsPerEmail[JSON.stringify(email)] || [];
        console.log("Email rows:");
        console.log(emailRows);
        // return processRowsForEmail(email, emailRows, file_path, template_name);
        if (emailRows.length > 0) {
          return processRowsForEmail(
            email,
            emailRows,
            file_path,
            template_name
          );
        } else {
          console.log(
            `Skipping processing for email ${email} as rows array is empty.`
          );
        }
      })
    );

    console.log("All rows processed successfully.");
  } catch (err) {
    console.error("Error processing rows:", err);
  }
}

async function processRowsForEmail(email, rows, file_path, template_name) {
  try {
    //console.log(email, rows,file_path,template_name)
    await Promise.all(
      rows.map((row) => mergeAndSendEmail(file_path, row, template_name, email))
    );
    console.log(`Rows processed successfully for ${email}`);
  } catch (err) {
    console.error(`Error processing rows for ${email}:`, err);
  }
}

exports.uploadCSVandSelectTemplate = async (req, res, next) => {
  const template = req.body.template_id;
  text = await extractTextFromDocx("./templates/" + template);
  console.log(`Extracted text from Docx: ${text}`);

  let placeholders = await countPlaceholdersInText(text);
  console.log(`Placeholders: ${placeholders}`);

  let column_names = await getAttributesFromCSV(
    "./csv_data/" + req.file.filename
  );
  console.log(`Column names: ${column_names}`);

  if (compareArraysIgnoringEmail(placeholders, column_names) === false) {
    fs.unlinkSync("./csv_data/" + req.file.filename);
    return res
      .status(400)
      .json({ message: "Placeholders and csv attributes do not match" });
  }
  ans = await parseCSVtoJSON("./csv_data/" + req.file.filename, placeholders);

  processRowsWithParallelEmails(
    ans,
    emailAccounts,
    "./templates/" + template,
    template
  );

  return res.status(200).json({ message: "done" });
};
