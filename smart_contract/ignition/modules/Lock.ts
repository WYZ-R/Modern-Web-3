// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

//知识点：
// 时间戳：区块链中常用 Unix 时间表示时间（单位：秒）。
//​单位转换：以太坊中 1 Gwei = 0.000000001 ETH，用于表示小额金额。
//BigInt：TypeScript 中的大整数类型（后缀 n）
const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const LockModule = buildModule("LockModule", (m) => {
  //如何获取参数并提供参数名称作为第一个参数。您还可以通过提供第二个参数 m.getParameter 来使参数可选，该参数将作为未提供参数时的默认值。
  //知识点：
  //从外部获取参数 unlockTime（解锁时间）和 lockedAmount（锁定金额）。
  //如果外部未提供，使用默认值（JAN_1ST_2030 和 ONE_GWEI）
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);
  // 创建合约，第一个参数是合约id也就是合约名称，第二个参数是构造函数所需要的数组，第三个这个value是向构造函数发送的ETH，1gwei
  const lock = m.contract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  return { lock };
});

export default LockModule;
