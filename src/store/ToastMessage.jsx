// 建立彈出訊息框

import { useEffect } from "react";

import { useSelector, useDispatch } from 'react-redux';

import { clearMessage } from "./MessageSlice";

export default function ToastMessage(){

  const dispatch=useDispatch();
  //從Redux抓出狀態
  const {isOpen,type,text}= useSelector((state)=>state.message);
  // 💡 自動關閉機制：只要 isOpen 變成 true，就開始倒數 3 秒
  useEffect(()=>{
    if(isOpen){
      const timer= setTimeout(()=>{
        dispatch(clearMessage());
      },3000);
      return ()=>clearTimeout(timer);
    };
  },[isOpen ,dispatch]);

  // 沒有打開-->不要渲染任何東西
  if(!isOpen) return null;

  // 根據type決定提示框顏色
  let alertClass= ''
    
  if(type==='success'){
    alertClass='alert-success';
  }else if(type==='warning'){
    alertClass ='alert-warning';
  }else if(type==='error'){
    alertClass='alert-danger';
  }else if(type==='normal'){
    alertClass = 'alert-info';
  }

  return (
  // 把顯示訊息定位在畫面正中央
    <div
      className={`alert ${alertClass} shadow-lg`}
      style={{
        position:"fixed",
        top:"30px",
        left:"50%",
        transform:'translateX(-50%)',
        zIndex:10000,
        minWidth: '300px',
        textAlign:'center'
      }}>
      <strong>{text}</strong>
    </div>
  )
}