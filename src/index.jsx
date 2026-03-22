import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/all.scss'
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import store from './store/store';

// 🌟 關鍵破解：請一定要補上這行，把 Bootstrap 的「動作靈魂」灌進去！
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// 讓 Vite 幫你在這編譯並打包所有 SVG
import 'virtual:svg-icons-register';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
