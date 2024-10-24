export default [
  {
    id: 'welcome',
    messages: ['welcoming message'],
    buttons: [
      {
        text: 'start chat',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  {
    id: 'start',
    messages: ['start question'],
    buttons: [
      {
        text: 'go to variant1',
        nextStepId: 'variant1',
        type: 'button',
      },
      {
        text: 'go to variant2',
        nextStepId: 'variant2',
        type: 'button',
      },
      {
        text: 'go to variant3',
        nextStepId: 'variant3',
        type: 'button',
      },
    ],
  },
  {
    id: 'variant1',
    messages: ['variant1 question'],
    buttons: [
      {
        text: 'go to variant1_1',
        nextStepId: 'variant1_1',
        type: 'button',
      },
      {
        text: 'go to variant1_2',
        nextStepId: 'variant1_2',
        type: 'button',
      },
    ],
  },
  {
    id: 'variant1_1',
    messages: ['variant1_1 question'],
    buttons: [
      {
        text: 'go to variant1',
        nextStepId: 'variant1',
        type: 'button',
      },
      {
        text: 'go to start',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  {
    id: 'variant1_2',
    messages: ['variant1_2 question'],
    buttons: [
      {
        text: 'go to start',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  {
    id: 'variant2',
    messages: ['variant2 question'],
    buttons: [
      {
        text: 'go to start',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  {
    id: 'variant3',
    messages: ['variant3 question'],
    buttons: [
      {
        text: 'go to variant3_1',
        nextStepId: 'variant3_1',
        type: 'button',
      },
    ],
  },
  {
    id: 'variant3_1',
    messages: ['variant3_1 question'],
    buttons: [
      {
        text: 'go to variant3_2',
        nextStepId: 'variant3_2',
        type: 'button',
      },
    ],
  },
  {
    id: 'variant3_2',
    messages: ['variant3_2 question'],
    buttons: [
      {
        text: 'go to start',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
];
