import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // 💡 1. 忽略不需要檢查的資料夾 (這是你報錯破三千的主要原因！)
  { ignores: ["dist", "build", "node_modules", "upload.js", "**/*.test.js"] },

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node, // 讓 ESLint 認得 process, require 等 Node.js 語法
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } }, ///更換成較舊版本,避免bug
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // 引入推薦規則
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // 💡 2. 關閉或放寬一些太嚴格的規定
      'react/prop-types': 'off', // 關閉 prop-types 檢查 (你沒用 TS，關掉才不會狂報錯)
      'no-unused-vars': 'warn',  // 變數宣告了卻沒用到，給「警告」就好，不要報錯
      'react/no-unknown-property': 'warn', // 針對 class 寫成 className 給警告
      'react-hooks/exhaustive-deps': 'warn', // useEffect 依賴陣列缺少變數時給警告
    },
  },
]