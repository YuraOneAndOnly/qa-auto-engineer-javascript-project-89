export default [
  {
    id: 'welcome',
    messages: ['Привет! Я ваш виртуальный помощник. Нажмите "Начать разговор", чтобы открыть чат'],
    buttons: [
      {
        text: 'Начать разговор',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  {
    id: 'start',
    messages: ['Какой фрукт вы предпочитаете?'],
    buttons: [
      {
        text: 'Яблоки',
        nextStepId: 'recipe',
        type: 'button',
      },
      {
        text: 'Груши',
        nextStepId: 'recipe',
        type: 'button',
      },
      {
        text: 'Апельсины',
        nextStepId: 'recipe',
        type: 'button',
      },
      {
        text: 'Лимоны',
        nextStepId: 'ew',
        type: 'button',
      },
    ],
  },
  {
    id: 'recipe',
    messages: ['Интересно... А в каком виде?'],
    buttons: [
      {
        text: 'С сахаром',
        nextStepId: 'withSugar',
        type: 'button',
      },
      {
        text: 'Как пюре',
        nextStepId: 'mashed',
        type: 'button',
      },
      {
        text: 'Как есть',
        nextStepId: 'asIs',
        type: 'button',
      },
    ],
  },
  {
    id: 'withSugar',
    messages: ['Да, с сахаром получается круто, сладко... Можем еще поговорить, хотите?'],
    buttons: [
      {
        text: 'Да, конечно',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  {
    id: 'mashed',
    messages: ['Пюре - супер кайф. Полностью согласен. Можем еще поговорить, хотите?'],
    buttons: [
      {
        text: 'Да, конечно',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  {
    id: 'asIs',
    messages: ['Натуральное значит? Уважаю, уважаю. Можем еще поговорить, хотите?'],
    buttons: [
      {
        text: 'Да, конечно',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  {
    id: 'ew',
    messages: ['Фу... :puke: Не, ну на этом наш разговор окончен. Не пиши мне больше!!!'],
    buttons: [
      {
        text: 'Эй, ты чего?',
        nextStepId: 'ewLoop',
        type: 'button',
      },
    ],
  },
  {
    id: 'ewLoop',
    messages: ['ГОВОРЮ ЖЕ!!! НЕ ПИШИ МНЕ!!!'],
    buttons: [
      {
        text: 'Эй, ты чего?',
        nextStepId: 'ewLoop',
        type: 'button',
      },
    ],
  },
];
