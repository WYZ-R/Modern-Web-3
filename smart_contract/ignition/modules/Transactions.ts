// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TransactionsModule = buildModule("TransactionsModule", (m) => {
  // 创建合约，第一个参数是合约id也就是合约名称，第二个参数是构造函数所需要的数组，第三个这个value是向构造函数发送的ETH，1gwei
  const transactions = m.contract("Transactions", []);

  return { transactions };
});

export default TransactionsModule;

//合约地址：0x5FbDB2315678afecb367f032d93F642f64180aa3
