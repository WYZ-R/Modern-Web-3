import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// 就是存储一些值的，会保存在一个vars.json文件里，到时候自己会去取这些值
import { vars } from "hardhat/config";
// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and set the Hardhat configuration variable
// ALCHEMY_API_KEY to the key
const INFURA_API_KEY = vars.get("INFURA_API_KEY");
//4d4c7d07efb0440690aad69b499a1a95

// Replace this private key with your Sepolia test account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

//0xb3d34429a61266f116c1bafcc080f613b71d28e103d99fe3a6238584bd12adc6

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  etherscan: {
    apiKey: "BEXS366WE5JAV43XM5HXIQAPC7BKQPVX66",
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};

export default config;

//  合约地址：0x86a1E8e9Dba8e2145fAc5e4484b2dD88dF1F3677
