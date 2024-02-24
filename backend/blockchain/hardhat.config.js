require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.7.3",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/XhtLUpUoyxXM_IGhLC7TjlybZGZLyWYR",
      accounts: ["546e33a261229d700bfd6554cde9446247c9962c4f08c1a6b3a752fa32d812d7"]
    }
  },
}