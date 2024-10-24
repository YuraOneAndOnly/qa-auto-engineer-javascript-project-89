export default [
  {
    id: 'welcome',
    messages: ['welcome message'],
    buttons: [
      {
        text: 'welcome button',
        nextStepId: 'lvl1',
        type: 'button',
      },
    ],
  },
  {
    id: 'lvl1',
    messages: ['lvl1 message1', 'lvl1 message2'],
    buttons: [
      {
        text: 'lvl1 button1',
        nextStepId: 'welcome',
        type: 'button',
      },
      {
        text: 'lvl1 button2',
        nextStepId: 'welcome',
        type: 'button',
      },
    ],
  },
];
