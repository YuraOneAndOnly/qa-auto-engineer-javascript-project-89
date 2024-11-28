import ReactDOM from 'react-dom/client';
import '@hexlet/chatbot-v2/styles';
/*
// рендер пустой страницы с виджетом
import Widget from '@hexlet/chatbot-v2';
// import steps from '@hexlet/chatbot-v2/example-steps'; // стандартные шаги
 import steps from '../__fixtures__/example-steps.js'; // мои кастомные шаги
const container = document.getElementById('root');
ReactDOM.createRoot(container)
  .render(Widget(steps));
*/
// рендер виджета как импортированного модуля
import App from './App.jsx';
import React from 'react';
const container = document.getElementById('root');
ReactDOM.createRoot(container)
  .render(<App/>);
