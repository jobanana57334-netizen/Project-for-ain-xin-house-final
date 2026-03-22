import { createSlice } from '@reduxjs/toolkit';

// 預設資料顯示
const initialState= {
    isOpen : false , //確認訊息框是否開啟
    type: 'success', //訊息類型(成功||失敗)
    text : ''  //訊息文字內容
};

export const MessageSlice =createSlice({
    name:"message",
    initialState,
    reducers:{
        // 動作1:開啟訊息
        showMessage: (state,action)=>{
            state.isOpen=true;
            state.type= action.payload.type; //接收傳來的類別
            state.text = action.payload.text; //接收傳來的文字內容
        },

        //動作2:關閉訊息
        clearMessage: (state)=>{
            state.isOpen=false;
            state.text = '';
        }
    }
});


export const {showMessage,clearMessage} = MessageSlice.actions;
export default MessageSlice.reducer;