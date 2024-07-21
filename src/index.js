import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css'; // Adjust if you have an index.css file
import App from './App'; // Adjust if your main component has a different name or path

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);