import * as monaco from 'monaco-editor';

const intel8080Conf: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: ';',
  },
  brackets: [
    ['[', ']'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"', notIn: ['string'] },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
};

const intel8080Language: monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.8080asm',
  ignoreCase: true,
  brackets: [
    { open: '[', close: ']', token: 'delimiter.square' },
  ],
  keywords: [
    'ACI',
    'ADI',
    'ANA',
    'ANI',
    'CMA',
    'CMC',
    'CMP',
    'CM',
    'CPI',
    'DAA',
    'DAD',
    'DCX',
    'INR',
    'INX',
    'IN',
    'JC',
    'JM',
    'JMP',
    'JNZ',
    'JP',
    'JPE',
    'JPO',
    'JZ',
    'LDA',
    'LDAX',
    'LHLD',
    'LXI',
    'MOV',
    'MVI',
    'NOP',
    'ORA',
    'ORI',
    'PCHL',
    'POP',
    'RET',
    'RIM',
    'RLC',
    'RNC',
    'RNZ',
    'RP',
    'RPE',
    'RPO',
    'RRC',
    'RST',
    'RZ',
    'SBB',
    'SHLD',
    'SPHL',
    'STA',
    'STAX',
    'STC',
    'SUB',
    'XRA',
    'XRI',
    'XTHL',
    'ORG',
    'LXI',
    'DCX',
    'CPI',
    'ANI',
    'MVI',
    'OUT',
    'RST',
    'JNC',
    'ADD'
  ],
  operators: [
    '+',
    '-',
    '*',
    '/',
    '=',
    '<',
    '>',
    '!',
    '&',
    '|',
    '^',
    '%',
    ':'
  ],

  tokenizer: {
    root: [
      [/[+\-*\/\=<>!\&\|%]/, 'operator'],
      [/\d+/, 'number'],
      [/[a-zA-Z_]\w*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
      [/;[^\n]*/, 'comment'],
      [/\s+/, ''], 
      [/:\s*/, 'delimiter'], // labels
      [/0[xX][0-9a-fA-F]+/, 'number'], // hexadecimal numbers with prefix 0x or 0X
      [/0[0-7]+/, 'number'], // octal numbers with prefix 0
      [/\$[0-9a-fA-F]+/, 'number'], // hexadecimal numbers with prefix $
      [/[0-9]+/, 'number'], // decimal numbers
    ],
  },
};

export { intel8080Conf, intel8080Language };
