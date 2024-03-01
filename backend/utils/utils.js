const nodemailer = require("nodemailer");
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const {v4 : uuidv4} = require("uuid");
const csv = require("csv-parser");
const mammoth = require('mammoth');
const fs = require("fs");
const crypto = require("crypto");
var reader = require('any-text');

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
function getUnixTimestampForNextMonths(numMonths) {
    const currentDate = new Date();
    const nextDate = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + numMonths);
    const currentUnixTimestamp = Math.floor(currentDate.getTime() / 1000);
    const nextUnixTimestamp = Math.floor(nextDate.getTime() / 1000);
    return { currentUnixTimestamp, nextUnixTimestamp };
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
function parseCSVtoJSON(csvFilePath,placeholders){
    return new Promise((resolve,reject)=>{
        const jsonArray = [];
        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data',(row) => {
            var temp = {};
            var keys = Object.keys(row);
            for (var i = 0;i < placeholders.length;i++){
                if(placeholders[i].trim() === keys[0].trim()){
                    temp[placeholders[i]] = row[keys[0]]
                }
                else{
                    temp[placeholders[i]] = row[placeholders[i]]
                }
            }
            var emailObject = {email : row["email"]}
            if(row.hasOwnProperty("expiry")){
                var expiryObject = {expiry : row["expiry"]}
                jsonArray.push([temp,emailObject,expiryObject])
            }
            else{
                jsonArray.push([temp,emailObject]);
            }
        })
        .on('end',() => {
            resolve(jsonArray)
        })
        .on('error',(error)=>{
            reject(error)
        })
    })
}
function parseCSVtoJSON(csvFilePath,placeholders){
    return new Promise((resolve,reject)=>{
        const jsonArray = [];
        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data',(row) => {
            var temp = {};
            var keys = Object.keys(row);
            for (var i = 0;i < placeholders.length;i++){
                if(placeholders[i].trim() === keys[0].trim()){
                    temp[placeholders[i]] = row[keys[0]]
                }
                else{
                    temp[placeholders[i]] = row[placeholders[i]]
                }
            }
            var emailObject = {email : row["email"]}
            if(row.hasOwnProperty("expiry")){
                var expiryObject = {expiry : row["expiry"]}
                jsonArray.push([temp,emailObject,expiryObject])
            }
            else{
                jsonArray.push([temp,emailObject]);
            }
        })
        .on('end',() => {
            resolve(jsonArray)
        })
        .on('error',(error)=>{
            reject(error)
        })
    })
}

/*async function extractTextFromDocx(filePath) {
    try {
        const result = await mammoth.extractRawText({path : filePath});
        console.log(result)
        return result.value;
    } catch (error) {
        throw error;
    }
}*/
async function extractTextFromDocx(filePath) {
    try {
        const text = await reader.getText(filePath);
        return text;
    } catch (error) {
        throw error;
    }
}

function countPlaceholdersInText(text) {
    const pattern = /{{.*?}}/g;
    const matches = text.match(pattern) || [];
    return [...new Set(matches.map(match => match.replace(/{{|}}/g, '').trim()))];
}
function calculatePDFHash(filePath, salt, algorithm = 'sha256') {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
        fileStream.on('data', (data) => {
            hash.update(data);
        });

        fileStream.on('end', () => {
            // Adding salt to the hash
            hash.update(salt);
            
            const fileHash = hash.digest('hex');
            resolve(fileHash);
        });

        fileStream.on('error', (error) => {
            reject(error);
        });
    });
}
function serializeWithDelimiter(array, delimiter) {
    return array.map(item => JSON.stringify(item)).join(delimiter);
}
function compareArraysIgnoringEmail(placeholderArray, attributeArray) {
    const cleanPlaceholder = placeholderArray.filter(attr => attr !== 'email').filter(attr => attr != 'expiry').map(attr => attr.trim());
    const cleanAttribute = attributeArray.filter(attr => attr !== 'email').filter(attr => attr != 'expiry').map(attr => attr.trim());
    const sortedPlaceholder = cleanPlaceholder.slice().sort();
    const sortedAttribute = cleanAttribute.slice().sort();
    const arraysAreEqual = JSON.stringify(sortedPlaceholder) === JSON.stringify(sortedAttribute);
    return arraysAreEqual;
}
module.exports = {sendVerificationEmail,deserializeWithDelimiter,createPDF,getUnixTimestampForNextMonths,getAttributesFromCSV,
                parseCSVtoJSON,extractTextFromDocx,countPlaceholdersInText,calculatePDFHash,serializeWithDelimiter,
                compareArraysIgnoringEmail}