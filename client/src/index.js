import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/app/App.js';
import reportWebVitals from './reportWebVitals';
import { app } from './config/firebase'; // dari index.js
import { createStore } from 'redux';

console.log("config firebase ==>", app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
