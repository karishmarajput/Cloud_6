<h1 align="center" id="title">Verifier: Blockchain based certificate generation and validation </h1>

<p id="description">The core purpose of the system is to provide a platform for diverse organizations to manage both certificate issuance and verification processes. The system will use this information to make certificates and send them to the recipients via email. While making each certificate a hash will be created using the certificate information and this hash will be stored blockchain with certificate ID and all the data is stored in database.The system relies on the certificate ID provided by the organizer. It uses this certificate ID to retrieve the unique hash stored in the blockchain (H1). Then it generates a hash using the uploaded certificate for verification (H2). These two hashes are compared to confirm the authenticity of the certificate.</p>

<a href="https://github.com/karishmarajput/Cloud_6">Project</a>
  
<h2>Features:</h2>

Here're some of the project's best features:

*   Secure Verification- Our platform ensures the security and authenticity of certificate verification.
*   User-friendly Interface- Enjoy a user-friendly interface for a seamless and intuitive verification process.
*   Fast and Reliable- Experience fast and reliable verification services ensuring quick results.

  
  
<h2>Built with</h2>

Technologies used in the project:

*   NodeJS
*   React
*   Solidity
*   Truffle

<h2>Supporting Message:</h2>

Empowering organizations with a secure and efficient platform our Certificate Management System ensures seamless certificate issuance and verification leveraging blockchain technology for tamper-proof integrity.

## Features


## Installation

### Prerequisites

- Node.js and npm installed on your machine
- Internet connection

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
   
