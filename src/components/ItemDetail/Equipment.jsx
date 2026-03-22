import React from 'react';
// 💡 引入你寫好的 SVG 小幫手 (請確認路徑是否正確)
import SvgIcon from '../SvgIcons';

const black= "#000";
const gray = "#ABABAB";

const Equipment = ({ houseData }) => {
    console.log("🏠 房子 ID:", houseData?.id, "設備清單:",houseData?.equipmentIds ,houseData?.requirementIds);
    // 💡 1. 預防資料還沒進來時報錯，先給預設空陣列
    const equipmentIds = houseData?.equipmentIds || [];
    const requirementIds = houseData?.requirementIds || [];

    // 🌟 建立防呆比對小幫手
    const checkIsActive = (dataArray, targetId) => {
        // 1. 如果資料庫傳來的根本不是陣列（例如傳成字串），直接當作沒有，避免誤判
        if (!Array.isArray(dataArray)) return false; 
        
        // 2. 使用 some 精準比對，並統一轉成字串，避免數字 1 與字串 "1" 對不上的問題
        return dataArray.some(id => String(id) === String(targetId));
    };

    // 2. 上半部：硬體設備陣列
    // 把原本 import 的元件換成字串 iconName，並且動態計算 isActive
    const equipmentList = [
        { id: 1, label: '有電梯', iconName: 'elevatorIcon' },
        { id: 2, label: '有車位', iconName: 'parkingIcon' },
        { id: 3, label: '有冰箱', iconName: 'cupboardIcon' }, 
        { id: 4, label: '有桌椅', iconName: 'deskIcon' },
        { id: 5, label: '單人床', iconName: 'singlebedIcon' },
        { id: 6, label: '雙人床', iconName: 'BedIcon' },
        { id: 7, label: '有對外窗', iconName: 'windowIcon' },
        { id: 8, label: '有沙發', iconName: 'sofaIcon' },
        { id: 9, label: '有電視', iconName: 'TVIcon' },
        { id: 10, label: '有衣櫃', iconName: 'wardRobeIcon' },
        { id: 11, label: '有網路', iconName: 'wifiIcon' },
        { id: 12, label: '有洗衣機', iconName: 'washingMachineIcon' },
        { id: 13, label: '有烘衣機', iconName: 'dryingMachineIcon' },
        { id: 14, label: '有冷氣', iconName: 'airConditioner' },
        { id: 15, label: '有熱水器', iconName: 'waterHeaterIcon' },
    ].map(item => ({
        ...item,
        // 🌟 換成用小幫手來判斷
        isActive: checkIsActive(equipmentIds, item.id)
    }));

    // 3. 下半部：房屋要求陣列
    const requirementList = [
        { id: 16, label: '可開伙', iconName: 'cookingIcon' },
        { id: 17, label: '可養寵物', iconName: 'dogCarrierIcon' },
        { id: 18, label: '有管理費', iconName: 'securityCameraIcon' }, 
    ].map(item => ({
        ...item,
        // 🌟 一樣換成用小幫手來判斷
        isActive: checkIsActive(requirementIds, item.id)
    }));

    // 4. 專門負責渲染單一 Icon 區塊的小幫手函數
    const renderIconItem = (item) => {
        return (
            // 利用 isActive 來判斷是否要加上 bootstrap 的透明度 class
            <div key={item.id} className={`col ${!item.isActive ? 'opacity-50' : ''}`}>
                <div className="d-flex flex-column align-items-center gap-2">
                    
                    {/* 🌟 換成你寫好的 SvgIcon！ */}
                    <SvgIcon 
                        name={`itemDeta-${item.iconName}` }
                        width="24px" 
                        height="24px" 
                        color={item.isActive ? black: gray} 
                    />
                    
                    {/* 文字顏色連動 isActive */}
                    <span 
                        className="small fw-medium" 
                        style={{ 
                            color: item.isActive ? black : gray,
                            textDecoration: item.isActive ? 'none' : 'line-through' // 關鍵這行！
                        }}
                    >
                        {item.label}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <section className="mb-5">
            <h3 className="fs-5 fw-bold mb-4 ps-3 border-start border-4 border-warning">
                設備與要求
            </h3>
            
            <div className="p-0 p-md-4 bg-white rounded-3 border border-light">
                
                {/* 上半部：設備 */}
                <div className="row row-cols-3 row-cols-md-6 gy-4">
                    {equipmentList.map(renderIconItem)}
                </div>

                {/* 中間分隔線 */}
                <hr className="text-secondary opacity-25 my-4" />

                {/* 下半部：要求 */}
                <div className="row row-cols-3 row-cols-md-6 gy-4">
                    {requirementList.map(renderIconItem)}
                </div>
                
            </div>
        </section>
    );
}

export default Equipment;