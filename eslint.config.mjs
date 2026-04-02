import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // 1. 忽略不需要檢查的資料夾
  { ignores: ["dist", "build", "node_modules", "upload.js", "**/*.test.js"] },

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      // 不允許使用 console.log，但允許 console.warn 和 console.error
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // --- 🏛️ 硬性縮排與基本規定 (Error) ---
      'indent': ['error', 2],                // 一般 JS 縮排 2 格
      'react/jsx-indent': ['error', 2],       // JSX 標籤縮排 2 格
      'react/jsx-indent-props': ['error', 2], // JSX 屬性縮排 2 格
      
      // --- 🚨 嚴格品質監控 (全部由 Warn 升級為 Error) ---
      
      // 1. 變數宣告了就一定要用到，不准留著垃圾代碼
      'no-unused-vars': ['error', { 
        "vars": "all", 
        "args": "after-used", 
        "ignoreRestSiblings": true 
      }],

      // 2. 針對 class 寫成 className 給予硬性報錯
      'react/no-unknown-property': ['error', { ignore: ['class'] }], 

      // 3. React Hooks 的依賴陣列必須完整，少寫一個都不行
      'react-hooks/exhaustive-deps': 'error', 

      // --- 其他自定義規則 ---
      'react/prop-types': 'off', // 沒用 TS 的情況下，維持關閉以避免過度報錯
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
]