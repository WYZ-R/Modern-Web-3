// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCount;

    //event的作用是啥来的？我记得是类似日志的作用 keyword的作用是？
    event Transfer(address from,address receiver,uint amount,string message,uint256 timestamp,string keyword);

    // 结构体的作用是？
    struct TransferStruct {
    address sender;
    address receiver;
    uint amount;
    string message;
    uint256 timestamp;
    string keyword;
    }

    
    TransferStruct[] transactions;


    //payable 可支付地址 memory
    function addToBlockchain(address payable receiver,uint amount,string memory message,string memory keyword)public {
        transactionCount +=1;
        // push方法的作用是？msg.sender作用是？block.timestamp
        transactions.push(TransferStruct(msg.sender,receiver,amount,message,block.timestamp,keyword));
        // 调用event,作用是？
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }
}