// 訊息切片倉庫

import { configureStore } from "@reduxjs/toolkit";

import messageReducer from './MessageSlice';
// 為什麼你在 store.js 寫 messageReducer 能抓到東西?

// 因為它就是接收了你在 MessageSlice.js 預設匯出的那個 MessageSlice.reducer。

const store = configureStore({
  reducer:{
    // 把訊息message交由被賦予messageReducer(將./MessageSlice路徑命名)來管理
    message: messageReducer
  }
})

export default store;