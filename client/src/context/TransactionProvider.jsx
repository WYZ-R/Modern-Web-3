import React, { children, createContext, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../utils/constants";
import { TransactionContext } from "./TransactionContext";
import { useState } from "react";

const { ethereum } = window;

//创建以太坊合约
const createEthereumContract = () => {
  // 提供者（以以太币计）是提供与以太坊网络连接的抽象的类。它提供对区块链及其状态的只读访问权限。
  //快递车，连接区块链网络的统计股
  const provider = new ethers.provider.Web3Provider(window.ethereum);
  //签名者是一个（通常）以某种方式直接或间接地访问私钥的类，它可以签署消息和交易以授权网络向您的帐户收取以太币来执行操作。
  //快递员工牌，证明有权限从你钱包代发快递
  const signer = provider.getSigner();
  //合约是一种抽象，它代表与以太坊网络上特定合约的连接，以便应用程序可以像普通 JavaScript 对象一样使用它。
  //打包好的快递包裹（智能合约的调用接口）。
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log({
    provider,
    signer,
    transactionsContract,
  });
};

// 这段代码有何作用？children的作用是什么？children是子组件
//包裹所有子组件（children），并告诉它们：“以后要寄快递，直接来我这里拿工具！
export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  // useEffect作用？这里的作用就是在组件渲染后只执行一次这里的代码,这里居然不能直接使用currentAccount
  useEffect((currentAccount) => {
    checkIfWalletIsConnect();
    if (currentAccount) {
      console.log(currentAccount);
    }
  }, []);
  // 钱包是否连接
  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      console.log(accounts);
      //重新加载页面：强制刷新当前页面，重新从服务器获取资源（如 HTML、CSS、JavaScript 等）
      // window.location.reload();
    } catch (error) {
      if (error.code === 4001) {
        console.log("Please connect to MetaMask");
      } else {
        console.error(error);
      }
    }
  };

  return (
    // 键值对，如果你的键跟值都是同一名称就可以省略键
    <TransactionContext.Provider value={{ connectWallet, currentAccount }}>
      {children}
    </TransactionContext.Provider>
  );
};
