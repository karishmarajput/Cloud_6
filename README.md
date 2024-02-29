# Verifier: Blockchain-based Certificate Generation and Validation

The system's core purpose is to provide a platform for diverse organizations to manage both certificate issuance and verification processes. The system will use this information to generate certificates and email them to the recipients. While making each certificate, a hash will be created using the certificate information, and this hash will be stored on the blockchain network with the certificate ID. All the data is stored in the database. The system relies on the certificate ID provided by the organizer. It uses this certificate ID to retrieve the unique hash stored in the blockchain (H1). Then it generates a hash using the uploaded certificate for verification (H2). These two hashes are compared to confirm the authenticity of the certificate.

[Project](https://github.com/karishmarajput/Cloud_6)

## Features:

Here are some of the project's best features:

* **Secure Verification**: Our platform ensures the security and authenticity of certificate verification.
* **User-friendly Interface**: Enjoy a user-friendly interface for a seamless and intuitive verification process.
* **Fast and Reliable**: Experience fast and reliable verification services ensuring quick results.

## Workflow:

| Generation | Verification |
| ------------- |:-------------:|
| <img align="center" src="https://raw.githubusercontent.com/karishmarajput/Cloud_6/main/client/public/working-1.png" alt="Generation" style="max-width: 100%; height: auto;"> | <img align="center" src="https://raw.githubusercontent.com/karishmarajput/Cloud_6/main/client/public/working-2.png" alt="Verification" style="max-width: 100%; height: auto;"> |

## Built with:

Technologies used in the project:

* NodeJS
* React
* Solidity
* Truffle

## Supporting Message:

Empowering organizations with a secure and efficient platform, our Certificate Management System ensures seamless certificate issuance and verification leveraging blockchain technology for tamper-proof integrity.

## Installation

### Prerequisites

- Node.js and npm
- Internet connection

### Steps

### Steps

1. **Clone the repository:**
   ```sh
   git clone https://github.com/karishmarajput/Cloud_6.git
2. **Setup env file:**
   ```sh
   MONGODB_URL=       # MongoDB connection URL
   JWT_KEY=           # Secret key for JWT token
   API_URL=           # API URL for backend server
   PRIVATE_KEY=       # Private key for Ethereum wallet
   CONTRACT_ADDRESS=  # Address of deployed smart contract
   CLOUDINARY_URL=    # Cloudinary URL for image storage
   EMAIL=             # Email address for sending certificates
   PASSWORD=          # Password for email account
   SALT=              # Salt for hashing passwords
   ```
3. **Setup Server:**
   ```sh
   cd backend
   npm install
   nodemon server.js
   ```
4. **Setup Client:**
   ```sh
   cd client
   npm install
   npm start
   ```
   
