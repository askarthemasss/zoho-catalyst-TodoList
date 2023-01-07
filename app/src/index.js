import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import MyApp from "./MyApp/MyApp"
import { createRoot } from 'react-dom/client';

// ============ OLD Method, App Render =============
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// After
// ============ NEW, MyApp Render =============
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<MyApp />);
