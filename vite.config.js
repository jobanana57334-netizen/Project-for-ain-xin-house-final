import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
export default defineConfig({
    // 註：這樣寫可以讓本地開發保持在 /，而打包上傳時會自動切換成 GitHub Pages 需要的路徑
    base: process.env.NODE_ENV === 'production' ? '/Project-for-ain-xin-house-final/' : '/',
    plugins: [
        react(),
        svgr(),
        // 加入 SVG Icons插件設定
        createSvgIconsPlugin({
            // 指定你要存放 SVG 的資料夾路徑 (請確認這個路徑跟你的實際資料夾一致)
            iconDirs: [path.resolve(process.cwd() , 'src/icons')],
            //定義在 DOM生成的 ID規則
            symbolId: 'icon-[dir]-[name]'
        })
    ],
    css:{
        preprocessorOptions:{
            scss:{
                // 隱藏來自 node_modules (例如 Bootstrap) 的警告
                quietDeps:true,
                // 針對你自己的 SCSS 檔案，隱藏特定類型的棄用警告
                silenceDeprecations:[
                    'import',
                    'global-builtin',
                    'if-function',
                    'color-functions'
                ]
            }
        }
    }
});