import ReactDOM from 'react-dom/client';
// import Widget from '@hexlet/chatbot-v2';
// import steps from '@hexlet/chatbot-v2/example-steps'; // стандартные шаги
// import steps from '../__fixtures__/exampleSteps.jsx'; // мои кастомные шаги
import '@hexlet/chatbot-v2/styles';

import App from './App.jsx';
import React from 'react';

// рендер пустой страницы с виджетом

const container = document.getElementById('root');
ReactDOM.createRoot(container)
  .render(Widget(steps));

/*
// рендер виджета как импортированного модуля
const container = document.getElementById('root');
ReactDOM.createRoot(container)
  .render(<App/>);
*/