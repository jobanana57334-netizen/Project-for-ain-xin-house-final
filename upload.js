const admin = require("firebase-admin");
const fs = require("fs");
const readline = require("readline"); // 引入讀取輸入的工具
const serviceAccount = require("./DO-NOT-UPLOADain-xin-house-db-496bdcdf66d7.json");

// 建立一個詢問介面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 1. 初始化之前，先亮出底牌
console.log("-----------------------------------------");
console.log("🛡️  防護系統啟動中...");
console.log(`📡 目前目標專案 ID: ${serviceAccount.project_id}`); // 這是你金鑰裡的專案名稱
console.log("-----------------------------------------");

rl.question("👉 您確定要將資料上傳至此專案嗎？(y/n) ", (answer) => {
  if (answer.toLowerCase() === "y") {
    
    // 開始執行原本的邏輯
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();
    const data = JSON.parse(fs.readFileSync("./db.json", "utf8"));

    async function uploadData() {
      console.log("🚀 傳送門啟動，開始改寫現實...");
      for (const collectionName in data) {
        const collectionData = data[collectionName];
        console.log(`📦 正在處理集合：${collectionName}`);
        for (const item of collectionData) {
          const docId = item.id ? String(item.id) : db.collection(collectionName).doc().id;
          await db.collection(collectionName).doc(docId).set(item);
        }
      }
      console.log("✨ 任務完成！資料已穩固降落在雲端領地。");
      process.exit(); // 結束程式
    }

    uploadData().catch((err) => {
      console.error("❌ 糟糕，發生意外：", err);
      process.exit(1);
    });

  } else {
    console.log("⛔ 操作已取消。大王英明，避開了一次可能的 GG 意外。");
    process.exit();
  }
});