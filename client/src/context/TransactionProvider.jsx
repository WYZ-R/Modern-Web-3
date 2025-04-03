import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";
import TransactionContext from "./TransactionContext";
import { BiColor } from "react-icons/bi";
const { ethereum } = window;

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

export const TransactionProvider = ({ children }) => {
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    Number(localStorage.getItem("transactionCount")) || 0
  );
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              Number(transaction.timestamp) * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: ethers.formatEther(transaction.amount),
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log("执行检查钱包是否连接，下一步获取所有交易");
        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();
        console.log("检查交易是否存在，下一步存储交易次数到localStorage");
        console.log("交易次数：" + currentTransactionCount);
        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = await createEthereumContract();
        const parsedAmount = ethers.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: `0x${parsedAmount.toString(16)}`,
            },
          ],
        });

        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount =
          await transactionsContract.getTransactionCount();

        setTransactionCount(Number(transactionsCount));
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
