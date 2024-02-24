const crypto = require('crypto');
const fs = require("fs")
const PDFParser = require("pdf2json")
const PDFExtract = require("pdf.js-extract").PDFExtract;
const ethers = require("ethers")
const pdfExtract = new PDFExtract();
const unzipper = require("unzipper")
const options = {};
const AdmZip = require("adm-zip")
const pdfParser = new PDFParser()
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY,provider)
const {abi} = require("../blockchain/artifacts/contracts/Certification.sol/Certification.json");
const contractAddress = process.env.CONTRACT_ADDRESS
const contractInstance = new ethers.Contract(contractAddress,abi,signer);
async function GetDataFromBlockchain(CertificateID){
    const res = await contractInstance.RetrieveData(CertificateID);
    return res
}
function getUnixTimestampForNextMonths(numMonths) {
    const currentDate = new Date();
    const nextDate = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + numMonths);
    const currentUnixTimestamp = Math.floor(currentDate.getTime() / 1000);
    const nextUnixTimestamp = Math.floor(nextDate.getTime() / 1000);
    return { currentUnixTimestamp, nextUnixTimestamp };
  }
function calculatePDFHash(filePath, algorithm = 'sha256') {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs.createReadStream(filePath);
 
    return new Promise((resolve, reject) => {
        fileStream.on('data', (data) => {
            hash.update(data);
        });
 
        fileStream.on('end', () => {
            const fileHash = hash.digest('hex');
            resolve(fileHash);
        });
 
        fileStream.on('error', (error) => {
            reject(error);
        });
    });
}
function findSeatNumber(data, searchString) {
    for (const item of data) {
      if (item.str.includes(searchString)) {
        const seatNumber = item.str.split(':')[1].trim();
        return seatNumber;
      }
    }
    return null;
  }
exports.UploadPDF = async(req,res) => {
    console.log('hello')
    const base_path = '../backend/pdf_upload/' + req.file.filename
    //console.log(base_path)
    const hash = await calculatePDFHash(base_path)
    //console.log(hash)
    pdfExtract.extract('../backend/pdf_upload/' + req.file.filename,options,async(err,data) => {
        if (err) return console.log(err);
        const searchString = 'Certificate ID';
        const seatNumber = findSeatNumber(data["pages"][0]["content"], searchString);
        console.log(seatNumber)
        if (seatNumber !== null) {
        //console.log(`Seat Number: ${seatNumber}`);
        const CurrentTime = getUnixTimestampForNextMonths().currentUnixTimestamp;
        const result = await GetDataFromBlockchain(seatNumber);
        
        if (result[2] === hash){
            return res.status(200).json({message : "Verified"})
        }
        else{
            return res.status(400).json({message : "Invalid"})
        }
        } else {
        console.log('Seat Number not found.');
        res.status(400).json({message : "Could not find id please upload again"})
        }
    })
}
async function UploadPDFFunction(file_name) {
    const base_path = '../backend/pdf_upload/' + file_name;

    const hash = await calculatePDFHash(base_path);

    return new Promise((resolve, reject) => {
        pdfExtract.extract(base_path, options, async (err, data) => {
            if (err) {
                console.log(err);
                reject({ seatNumber: null, Boolean: false, message: 'Error extracting PDF' });
            }

            const searchString = 'Certificate ID';
            const seatNumber = findSeatNumber(data["pages"][0]["content"], searchString);
            console.log(seatNumber);

            if (seatNumber !== null) {
                const CurrentTime = getUnixTimestampForNextMonths().currentUnixTimestamp;
                const result = await GetDataFromBlockchain(seatNumber);

                if (result[2] === hash) {
                    console.log(seatNumber, result);
                    resolve({ certificateID: seatNumber, Boolean: true });
                } else {
                    resolve({ certificateID: seatNumber, Boolean: false });
                }
            } else {
                console.log('certificateID not found.');
                reject({ seatNumber: null, Boolean: false, message: 'Could not find ID. Please upload again.' });
            }
        });
    });
}
exports.UploadZip = async(req,res) => {
    const base_path = "../backend/zip_upload/" + req.file.filename;
    const zipped_files_buffer = "../backend/pdf_upload/";
    const zip = new AdmZip(base_path);
    zip.extractAllTo(zipped_files_buffer,true);
    const zipEntries = zip.getEntries();
    const filenames = zipEntries.map(entry => entry.entryName);
    const data = []
    for(let i = 1;i < filenames.length;i++){
        console.log(await UploadPDFFunction(filenames[i]))
        data.push(await UploadPDFFunction(filenames[i]))
    }
    return res.status(200).json({data : data})
}

