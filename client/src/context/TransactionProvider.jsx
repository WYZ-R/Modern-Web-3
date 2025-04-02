import React, { children, createContext, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../utils/constants";
import { TransactionContext } from "./TransactionContext";
import { useState } from "react";

const { ethereum } = window;
const INFURA_API_KEY = "4d4c7d07efb0440690aad69b499a1a95";

//创建以太坊合约
const createEthereumContract = async () => {
  // 提供者（以以太币计）是提供与以太坊网络连接的抽象的类。它提供对区块链及其状态的只读访问权限。
  //快递车，连接区块链网络的统计股
  try {
    //这里没有使用sepolia的rpc节点会导致使用到主网，到时eth用的是主网的。后续验证跟这个没关系，就是okx那边网络设置没设置测试网而已
    // const provider = new ethers.JsonRpcProvider(
    //   `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
    // );
    const provider = new ethers.BrowserProvider(ethereum);
    console.log("Provider:", provider);
    //签名者是一个（通常）以某种方式直接或间接地访问私钥的类，它可以签署消息和交易以授权网络向您的帐户收取以太币来执行操作。
    //快递员工牌，证明有权限从你钱包代发快递
    const signer = await provider.getSigner();
    console.log("Signer:", signer);
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

    return transactionsContract;
  } catch (error) {
    console.log(error);
  }
};

// 这段代码有何作用？children的作用是什么？children是子组件
//包裹所有子组件（children），并告诉它们：“以后要寄快递，直接来我这里拿工具！
export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // 这里的localStorage知识需要学习
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );

  // 这里好像是react的内容，这里要弄懂
  const handleChange = (e, name) => {
    console.log("handleChange called:", name, e.target.value);
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

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
      console.log(accounts);
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

  // 发送交易
  const sendTransaction = async () => {
    try {
      console.log("sendTransaction called");
      if (!ethereum) return alert("Please install MetaMask");
      // 解构
      const { addressTo, amount, keyword, message } = formData;
      // 创建交易合约
      const transactionsContract = createEthereumContract();
      // 将wei转化为eth单位
      const parsedAmount = ethers.parseEther(amount);

      // 发送交易方法
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            // 发送人
            from: currentAccount,
            // 接收人
            to: addressTo,
            //十六进制,去掉0x 用76c0来转化为10进制是30400单位是wei
            gas: "0x76c0",
            // ._hex 以十六进制（hex）格式存储数值。这里处理问题
            value: parsedAmount,
          },
        ],
      });
      console.log("金额:" + parsedAmount);
      console.log("金额(十六进制):" + parsedAmount._hex);
      //为什么我发送的钱是0？
      // 调用了我们合约的方法，为什么会返回一个hash
      const transactionHash = await transactionsContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      // .hash的作用是什么？
      console.log(`Loading - ${transactionHash.hash}`);
      //wait方法是哪里的？作用是什么？
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);
      const transactionsCount =
        await transactionsContract.getTransactionCount();
      setTransactionCount(transactionsCount.toNumber());
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    // 键值对，如果你的键跟值都是同一名称就可以省略键
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        isLoading,
        transactionCount,
        sendTransaction,
        formData,
        handleChange,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
