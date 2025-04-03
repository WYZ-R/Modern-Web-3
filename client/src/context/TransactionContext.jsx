import React, { createContext } from "react";

// 有什么作用？创建一个内容？
//创建了一个全局共享的数据仓库，所有组件可以从这里存取数据
const TransactionContext = createContext();

export default TransactionContext;
