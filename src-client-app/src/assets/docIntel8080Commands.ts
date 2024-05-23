interface DocIntel8080Command {
  name: string;
  description: string;
  code: number;
}

export const docIntel8080Commands = ([
  {
    name: 'ADD A',
    code: 0x87,
    description: 'A←(A) + (A)',
  },
  {
    name: 'ADD B',
    code: 0x80,
    description: 'A←(B) + (A)',
  },
  {
    name: 'ADD C',
    code: 0x81,
    description: 'A←(C) + (A)',
  },
  {
    name: 'ADD D',
    code: 0x82,
    description: 'A←(D) + (A)',
  },
  {
    name: 'ADD E',
    code: 0x83,
    description: 'A←(E) + (A)',
  },
  {
    name: 'ADD H',
    code: 0x84,
    description: 'A←(H) + (A)',
  },
  {
    name: 'ADD L',
    code: 0x85,
    description: 'A←(L) + (A)',
  },
  {
    name: 'ADD M',
    code: 0x86,
    description: 'A←Loc(HL) + (A)',
  },
  {
    name: 'ADI d8',
    code: 0xC6,
    description: 'A←d8 + (A)',
  },
  {
    name: 'ADC A',
    code: 0x8F,
    description: 'A←(A) + (A) + CY',
  },
  {
    name: 'ADC B',
    code: 0x88,
    description: 'A←(B) + (A) + CY',
  },
  {
    name: 'ADC C',
    code: 0x89,
    description: 'A←(C) + (A) + CY',
  },
  {
    name: 'ADC D',
    code: 0x8A,
    description: 'A←(D) + (A) + CY',
  },
  {
    name: 'ADC E',
    code: 0x8B,
    description: 'A←(E) + (A) + CY',
  },
  {
    name: 'ADC H',
    code: 0x8C,
    description: 'A←(H) + (A) + CY',
  },
  {
    name: 'ADC L',
    code: 0x8D,
    description: 'A←(L) + (A) + CY',
  },
  {
    name: 'ADC M',
    code: 0x8E,
    description: 'A←Loc(HL) + (A) + CY',
  },
  {
    name: 'ACI d8',
    code: 0xCE,
    description: 'A←d8 + (A) + CF',
  },
  {
    name: 'ANA A',
    code: 0xA7,
    description: 'Проверка A',
  },
  {
    name: 'ANA B',
    code: 0xA0,
    description: 'Логическое И B с A',
  },
  {
    name: 'ANA C',
    code: 0xA1,
    description: 'Логическое И C с A',
  },
  {
    name: 'ANA D',
    code: 0xA2,
    description: 'Логическое И D с A',
  },
  {
    name: 'ANA E',
    code: 0xA3,
    description: 'Логическое И E с A',
  },
  {
    name: 'ANA H',
    code: 0xA4,
    description: 'Логическое И H с A',
  },
  {
    name: 'ANA L',
    code: 0xA5,
    description: 'Логическое И L с A',
  },
  {
    name: 'ANA M',
    code: 0xA6,
    description: 'Логическое И Loc(HL) с A',
  },
  {
    name: 'ANI d8',
    code: 0xE6,
    description: 'Логическое И непосредственные данные с A',
  },
  {
    name: 'CALL a16',
    code: 0xCD,
    description: 'Передать управление подпрограмме по адресу a16',
  },
  {
    name: 'CZ a16',
    code: 0xCC,
    description: 'Вызвать подпрограмму по адресу a16, если нуль',
  },
  {
    name: 'СNZ a16',
    code: 0xC4,
    description: 'Вызвать подпрограмму по адресу a16, если не нуль',
  },
  {
    name: 'СP a16',
    code: 0xF4,
    description: 'Вызвать подпрограмму по адресу a16, если плюс',
  },
  {
    name: 'СM a16',
    code: 0xFC,
    description: 'Вызвать подпрограмму по адресу a16, если минус',
  },
  {
    name: 'CC a16',
    code: 0xDC,
    description: 'Вызвать подпрограмму по адресу a16, если перенос',
  },
  {
    name: 'CNC a16',
    code: 0xD4,
    description: 'Вызвать подпрограмму по адресу a16, если нет переноса',
  },
  {
    name: 'CPE a16',
    code: 0xEC,
    description: 'Вызвать подпрограмму по адресу a16, если чётно',
  },
  {
    name: 'CPO a16',
    code: 0xE4,
    description: 'Вызвать подпрограмму по адресу a16, если нечётно',
  },
  {
    name: 'CMA',
    code: 0x2F,
    description: 'Инвертировать A',
  },
  {
    name: 'CMC',
    code: 0x3F,
    description: 'Инвертировать перенос',
  },
  {
    name: 'CMP A',
    code: 0xBF,
    description: 'Установить флаг FZ',
  },
  {
    name: 'CMP B',
    code: 0xB8,
    description: 'Сравнить A с B',
  },
  {
    name: 'CMP C',
    code: 0xB9,
    description: 'Сравнить A с C',
  },
  {
    name: 'CMP D',
    code: 0xBA,
    description: 'Сравнить A с D',
  },
  {
    name: 'CMP E',
    code: 0xBB,
    description: 'Сравнить A с E',
  },
  {
    name: 'CMP H',
    code: 0xBC,
    description: 'Сравнить A с H',
  },
  {
    name: 'CMP L',
    code: 0xBD,
    description: 'Сравнить A с L',
  },
  {
    name: 'CMP M',
    code: 0xBE,
    description: 'Сравнить A с Loc(HL)',
  },
  {
    name: 'CPI d8',
    code: 0xFE,
    description: 'Сравнить A с непосредственными данными, заданными в команде',
  },
  {
    name: 'DAA',
    code: 0x27,
    description: 'Десятичная коррекция аккумулятора',
  },
  {
    name: 'DAD B',
    code: 0x09,
    description: 'Сложить BC с HL',
  },
  {
    name: 'DAD D',
    code: 0x19,
    description: 'Сложить DE с HL',
  },
  {
    name: 'DAD H',
    code: 0x29,
    description: 'Сложить HL с HL (удвоение HL)',
  },
  {
    name: 'DAD SP',
    code: 0x39,
    description: 'Сложить SP с HL',
  },
  {
    name: 'DCR A',
    code: 0x3D,
    description: 'A←(A) - 1 (декремент A)',
  },
  {
    name: 'DCR B',
    code: 0x05,
    description: 'B←(B) - 1',
  },
  {
    name: 'DCR C',
    code: 0x0D,
    description: 'C←(C) - 1',
  },
  {
    name: 'DCR D',
    code: 0x15,
    description: 'D←(D) - 1',
  },
  {
    name: 'DCR E',
    code: 0x1D,
    description: 'E←(E) - 1',
  },
  {
    name: 'DCR H',
    code: 0x25,
    description: 'H←(H) - 1',
  },
  {
    name: 'DCR L',
    code: 0x2D,
    description: 'L←(L) - 1',
  },
  {
    name: 'DCR M',
    code: 0x35,
    description: 'Loc (HL)←(Loc(HL)) -1',
  },
  {
    name: 'DCX B',
    code: 0x0B,
    description: 'BC←(BC) - 1',
  },
  {
    name: 'DCX D',
    code: 0x1B,
    description: 'DE←(DE) -1',
  },
  {
    name: 'DCX H',
    code: 0x2B,
    description: 'HL←(HL) - 1',
  },
  {
    name: 'DCX SP',
    code: 0x3B,
    description: 'SP←(SP) -1',
  },
  {
    name: 'DI',
    code: 0xF3,
    description: 'Запретить прерывания',
  },
  {
    name: 'EI',
    code: 0xFB,
    description: 'Разрешить прерывания',
  },
  {
    name: 'HLT',
    code: 0x76,
    description: 'Останов процессора',
  },
  {
    name: 'IN pp',
    code: 0xDB,
    description: 'Ввести данные из порта pp',
  },
  {
    name: 'INR A',
    code: 0x3C,
    description: 'A←(A) + 1 (инкрементировать A)',
  },
  {
    name: 'INR B',
    code: 0x04,
    description: 'Инкрементировать B',
  },
  {
    name: 'INR C',
    code: 0x0C,
    description: 'Инкрементировать C',
  },
  {
    name: 'INR D',
    code: 0x14,
    description: 'Инкрементировать D',
  },
  {
    name: 'INR E',
    code: 0x1C,
    description: 'Инкрементировать E',
  },
  {
    name: 'INR H',
    code: 0x24,
    description: 'Инкрементировать H',
  },
  {
    name: 'INR L',
    code: 0x2C,
    description: 'Инкрементировать L',
  },
  {
    name: 'INR M',
    code: 0x34,
    description: 'Инкрементировать содержимое Loc(HL)',
  },
  {
    name: 'INX B',
    code: 0x03,
    description: 'Инкрементировать BС',
  },
  {
    name: 'INX D',
    code: 0x13,
    description: 'Инкрементировать DE',
  },
  {
    name: 'INX H',
    code: 0x23,
    description: 'Инкрементировать HL',
  },
  {
    name: 'INX SP',
    code: 0x33,
    description: 'Инкрементировать SP',
  },
  {
    name: 'JMP a16',
    code: 0xC3,
    description: 'Перейти по адресу a16',
  },
  {
    name: 'JZ a16',
    code: 0xCA,
    description: 'Перейти по адресу a16, если нуль',
  },
  {
    name: 'JNZ a16',
    code: 0xC2,
    description: 'Перейти по адресу a16, если не нуль',
  },
  {
    name: 'JP a16',
    code: 0xF2,
    description: 'Перейти по адресу a16, если плюс',
  },
  {
    name: 'JM a16',
    code: 0xFA,
    description: 'Перейти по адресу a16, если минус',
  },
  {
    name: 'JC a16',
    code: 0xDA,
    description: 'Перейти по адресу a16, если перенос',
  },
  {
    name: 'JNC a16',
    code: 0xD2,
    description: 'Перейти по адресу a16, если нет переноса',
  },
  {
    name: 'JPE a16',
    code: 0xEA,
    description: 'Перейти по адресу a16, если паритет чётный',
  },
  {
    name: 'JPO a16',
    code: 0xE2,
    description: 'Перейти по адресу a16, если паритет нечётный',
  },
  {
    name: 'LDA a16',
    code: 0x3A,
    description: 'Загрузить A из  ячейки с адресом a16',
  },
  {
    name: 'LDAX B',
    code: 0x0A,
    description: 'Загрузить A из ячейки  с адресом Loc(BC)',
  },
  {
    name: 'LDAX D',
    code: 0x1A,
    description: 'Загрузить A из ячейки с адресом Loc(DE)',
  },
  {
    name: 'LHLD a16',
    code: 0x2A,
    description: 'Загрузить в HL содержимое ячейки с адресом a16',
  },
  {
    name: 'LXI B,d16',
    code: 0x01,
    description: 'Загрузить в BC непосредственные данные d16',
  },
  {
    name: 'LXI H,d16',
    code: 0x21,
    description: 'Загрузить в HL непосредственные данные d16',
  },
  {
    name: 'LXI SP,d16',
    code: 0x31,
    description: 'Загрузить в SP непосредственные данные d16',
  },
  {
    name: 'MOV A,A',
    code: 0x7F,
    description: 'Переслать из A в A ',
  },
  {
    name: 'MOV A,B',
    code: 0x78,
    description: 'Переслать из B в A (B←(A) )',
  },
  {
    name: 'MOV A,C',
    code: 0x79,
    description: 'Переслать из C в A',
  },
  {
    name: 'MOV A,D',
    code: 0x7A,
    description: 'Переслать из D в A',
  },
  {
    name: 'MOV A,E',
    code: 0x7B,
    description: 'Переслать из E в A ',
  },
  {
    name: 'MOV A,H',
    code: 0x7C,
    description: 'Переслать из H в A ',
  },
  {
    name: 'MOV A,L',
    code: 0x7D,
    description: 'Переслать из L в A ',
  },
  {
    name: 'MOV A,M',
    code: 0x7E,
    description: 'Переслать из Loc(HL) в A',
  },
  {
    name: 'MOV B,A',
    code: 0x47,
    description: 'Переслать из A в B',
  },
  {
    name: ' MOV B,B',
    code: 0x40,
    description: ' Переслать из B в B  (ещё одна странная команда)',
  },
  {
    name: 'MOV B,C',
    code: 0x41,
    description: 'Переслать из  Cв B',
  },
  {
    name: 'MOV B,D',
    code: 0x42,
    description: 'Переслать из  Dв B',
  },
  {
    name: 'MOV B,E',
    code: 0x43,
    description: 'Переслать из  Eв B',
  },
  {
    name: 'MOV B,H',
    code: 0x44,
    description: 'Переслать из  Hв B',
  },
  {
    name: 'MOV B,L',
    code: 0x45,
    description: 'Переслать из  Lв B',
  },
  {
    name: 'MOV B,M',
    code: 0x46,
    description: 'Переслать из Loc(HL)в B',
  },
  {
    name: 'MOV C,A',
    code: 0x4F,
    description: 'Переслать из  Aв C',
  },
  {
    name: 'MOV C,B',
    code: 0x48,
    description: 'Переслать из Bв C',
  },
  {
    name: ' MOV C,C',
    code: 0x49,
    description: ' Переслать из  C в C',
  },
  {
    name: 'MOV C,D',
    code: 0x4A,
    description: 'Переслать из  Dв C',
  },
  {
    name: 'MOV C,E',
    code: 0x4B,
    description: 'Переслать из  Eв C',
  },
  {
    name: 'MOV C,H',
    code: 0x4C,
    description: 'Переслать из  Hв C',
  },
  {
    name: 'MOV C,L',
    code: 0x4D,
    description: 'Переслать из  Lв C',
  },
  {
    name: 'MOV C,M',
    code: 0x4E,
    description: 'Переслать из  Loc(HL)в C',
  },
  {
    name: 'MOV D,A',
    code: 0x57,
    description: 'Переслать из   A вD',
  },
  {
    name: 'MOV D,B',
    code: 0x50,
    description: 'Переслать из  BвD',
  },
  {
    name: 'MOV D,C',
    code: 0x51,
    description: 'Переслать из  CвD',
  },
  {
    name: ' MOV D,D',
    code: 0x52,
    description: ' Переслать из D в D ',
  },
  {
    name: 'MOV D,E',
    code: 0x53,
    description: 'Переслать из  EвD',
  },
  {
    name: 'MOV D,H',
    code: 0x54,
    description: 'Переслать из  HвD',
  },
  {
    name: 'MOV D,L',
    code: 0x55,
    description: 'Переслать из  LвD',
  },
  {
    name: 'MOV D,M',
    code: 0x56,
    description: 'Переслать из  Loc(HL)вD',
  },
  {
    name: 'MOV E,A',
    code: 0x5F,
    description: 'Переслать из  Aв E',
  },
  {
    name: 'MOV E,B',
    code: 0x58,
    description: 'Переслать из B в E',
  },
  {
    name: 'MOV E,C',
    code: 0x59,
    description: 'Переслать из  C в E',
  },
  {
    name: 'MOV E,D',
    code: 0x5A,
    description: 'Переслать из  Dв E',
  },
  {
    name: ' MOV E,E',
    code: 0x5B,
    description: ' Переслать из E в E ',
  },
  {
    name: 'MOV E,H',
    code: 0x5C,
    description: 'Переслать из  Hв E',
  },
  {
    name: 'MOV E,L',
    code: 0x5D,
    description: 'Переслать из  Lв E',
  },
  {
    name: 'MOV E,M',
    code: 0x5E,
    description: 'Переслать из Loc(HL)в E',
  },
  {
    name: 'MOV H,A',
    code: 0x67,
    description: 'Переслать из  Aв H',
  },
  {
    name: 'MOV H,B',
    code: 0x60,
    description: 'Переслать из  Bв H',
  },
  {
    name: 'MOV H,C',
    code: 0x61,
    description: 'Переслать из  Cв H',
  },
  {
    name: 'MOV H,D',
    code: 0x62,
    description: 'Переслать из  Dв H',
  },
  {
    name: 'MOV H,E',
    code: 0x63,
    description: 'Переслать из  Eв H',
  },
  {
    name: ' MOV H,H',
    code: 0x64,
    description: ' Переслать из H в H ',
  },
  {
    name: 'MOV H,L',
    code: 0x65,
    description: 'Переслать из  Lв H',
  },
  {
    name: 'MOV H,M',
    code: 0x66,
    description: 'Переслать из  Loc(HL)в H',
  },
  {
    name: 'MOV L,A',
    code: 0x6F,
    description: 'Переслать из Aв L',
  },
  {
    name: 'MOV L,B',
    code: 0x68,
    description: 'Переслать из Bв L',
  },
  {
    name: 'MOV L,C',
    code: 0x69,
    description: 'Переслать из Cв L',
  },
  {
    name: 'MOV L,D',
    code: 0x6A,
    description: 'Переслать из Dв L',
  },
  {
    name: 'MOV L,E',
    code: 0x6B,
    description: 'Переслать из Eв L',
  },
  {
    name: 'MOV L,H',
    code: 0x6C,
    description: 'Переслать из Hв L',
  },
  {
    name: ' MOV L,L',
    code: 0x6D,
    description: ' Переслать из L в L ',
  },
  {
    name: 'MOV L,M',
    code: 0x6E,
    description: 'Переслать из Loc(HL)в L',
  },
  {
    name: 'MOV M,A',
    code: 0x77,
    description: 'Переслать из  Aв M',
  },
  {
    name: 'MOV M,B',
    code: 0x70,
    description: 'Переслать из  Bв M',
  },
  {
    name: 'MOV M,C',
    code: 0x71,
    description: 'Переслать из  Cв M',
  },
  {
    name: 'MOV M,D',
    code: 0x72,
    description: 'Переслать из  Dв M',
  },
  {
    name: 'MOV M,E',
    code: 0x73,
    description: 'Переслать из  Eв M',
  },
  {
    name: 'MOV M,H',
    code: 0x74,
    description: 'Переслать из  Hв M',
  },
  {
    name: 'MOV M,L',
    code: 0x75,
    description: 'Переслать из  Lв M',
  },
  {
    name: 'MVI A,d8',
    code: 0x3E,
    description: 'Переслать d8 в A',
  },
  {
    name: 'MVI B,d8',
    code: 0x06,
    description: 'Переслать d8 в B',
  },
  {
    name: 'MVI C,d8',
    code: 0x0E,
    description: 'Переслать d8 в C',
  },
  {
    name: 'MVI D,d8',
    code: 0x16,
    description: 'Переслать d8 в D',
  },
  {
    name: 'MVI E,d8',
    code: 0x1E,
    description: 'Переслать d8 в E',
  },
  {
    name: 'MVI H,d8',
    code: 0x26,
    description: 'Переслать d8 в H',
  },
  {
    name: 'MVI L,d8',
    code: 0x2E,
    description: 'Переслать d8 в L',
  },
  {
    name: 'MVI M,d8',
    code: 0x36,
    description: 'Переслать d8 в Loc(HL)',
  },
  {
    name: 'NOP ',
    code: 0x00,
    description: 'Нет операции',
  },
  {
    name: 'ORA A',
    code: 0xB7,
    description: 'Проверить A и сбросить перенос',
  },
  {
    name: 'ORA B',
    code: 0xB0,
    description: 'Логичеcкая операция A ИЛИ B ',
  },
  {
    name: 'ORA C',
    code: 0xB1,
    description: 'Логичеcкая операция A ИЛИ C ',
  },
  {
    name: 'ORA D',
    code: 0xB2,
    description: 'Логичеcкая операция A ИЛИ D ',
  },
  {
    name: 'ORA E',
    code: 0xB3,
    description: 'Логичеcкая операция A ИЛИ E ',
  },
  {
    name: 'ORA H',
    code: 0xB4,
    description: 'Логичеcкая операция A ИЛИ H ',
  },
  {
    name: 'ORA L',
    code: 0xB5,
    description: 'Логичеcкая операция A ИЛИ L ',
  },
  {
    name: 'ORA M',
    code: 0xB6,
    description: 'Логичеcкая операция A ИЛИ M ',
  },
  {
    name: 'ORI d8',
    code: 0xF6,
    description: 'Логичеcкая операция A ИЛИ d8 ',
  },
  {
    name: 'OUT pp',
    code: 0xD3,
    description: 'Записать A в порт pp',
  },
  {
    name: 'PCHL',
    code: 0xE9,
    description: 'Передать управление по адресу в HL',
  },
  {
    name: 'POP B',
    code: 0xC1,
    description: 'Извлечь слово из стека в BC',
  },
  {
    name: 'POP D',
    code: 0xD1,
    description: 'Извлечь слово из стека в DE',
  },
  {
    name: 'POP H',
    code: 0xE1,
    description: 'Извлечь слово из стека в HL',
  },
  {
    name: 'POP PSW',
    code: 0xF1,
    description: 'Извлечь слово из стека в PSW',
  },
  {
    name: 'PUSH B',
    code: 0xC5,
    description: 'Поместить в стек содержимое BC',
  },
  {
    name: 'PUSH D',
    code: 0xD5,
    description: 'Поместить в стек содержимое DE',
  },
  {
    name: 'PUSH H',
    code: 0xE5,
    description: 'Поместить в стек содержимое HL',
  },
  {
    name: 'PUSH PSW',
    code: 0xF5,
    description: 'Поместить в стек содержимое PSW',
  },
  {
    name: 'RAL',
    code: 0x17,
    description: 'Циклический сдвиг CY + A влево',
  },
  {
    name: 'RAR',
    code: 0x1F,
    description: 'Циклический сдвиг CY + A вправо',
  },
  {
    name: 'RLC',
    code: 0x07,
    description: 'Сдвинуть A влево на один разряд с переносом',
  },
  {
    name: 'RRC',
    code: 0x0F,
    description: 'Сдвинуть A вправо на один разряд с переносом',
  },
  {
    name: 'RIM',
    code: 0x20,
    description: 'Считать маску прерывания (только в 8085)',
  },
  {
    name: 'RET',
    code: 0xC9,
    description: 'Возврат из подпрограммы',
  },
  {
    name: 'RZ',
    code: 0xC8,
    description: 'Возврат из подпрограммы, если FZ=0',
  },
  {
    name: 'RNZ',
    code: 0xC0,
    description: 'Возврат из подпрограммы, если FZ=1',
  },
  {
    name: 'RP',
    code: 0xF0,
    description: 'Возврат из подпрограммы, если FP=1',
  },
  {
    name: 'RM',
    code: 0xF8,
    description: 'Возврат из подпрограммы, если FP=0',
  },
  {
    name: 'RC',
    code: 0xD8,
    description: 'Возврат из подпрограммы, если FC=1',
  },
  {
    name: 'RNC',
    code: 0xD0,
    description: 'Возврат из подпрограммы, если FC=0',
  },
  {
    name: 'RPE',
    code: 0xE8,
    description: 'Возврат из подпрограммы, если паритет чётный',
  },
  {
    name: 'RPO',
    code: 0xE0,
    description: 'Возврат из подпрограммы, если паритет нечётный',
  },
  {
    name: 'RST 0',
    code: 0xC7,
    description: 'Запуск программы с адреса 0',
  },
  {
    name: 'RST 1',
    code: 0xCF,
    description: 'Запуск программы с адреса 8h',
  },
  {
    name: 'RST 2',
    code: 0xD7,
    description: 'Запуск программы с адреса 10h',
  },
  {
    name: 'RST 3',
    code: 0xDF,
    description: 'Запуск программы с адреса 18h',
  },
  {
    name: 'RST 4',
    code: 0xE7,
    description: 'Запуск программы с адреса 20h',
  },
  {
    name: 'RST 5',
    code: 0xEF,
    description: 'Запуск программы с адреса 28h',
  },
  {
    name: 'RST 6',
    code: 0xF7,
    description: 'Запуск программы с адреса 30h',
  },
  {
    name: 'RST 7',
    code: 0xFF,
    description: 'Запуск программы с адреса 38h',
  },
  {
    name: 'SIM ',
    code: 0x30,
    description: 'Установить маску прерывания (только в 8085) ',
  },
  {
    name: 'SPHL',
    code: 0xF9,
    description: 'Загрузить SP из HL',
  },
  {
    name: 'SHLD a16',
    code: 0x22,
    description: 'Записать HL по адресу a16',
  },
  {
    name: 'STA a16',
    code: 0x32,
    description: 'Записать A по адресу a16',
  },
  {
    name: 'STAX B',
    code: 0x02,
    description: 'Записать A по адресу Loc(BC)',
  },
  {
    name: 'STAX D',
    code: 0x12,
    description: 'Записать A по адресу Loc(DE)',
  },
  {
    name: 'STC',
    code: 0x37,
    description: 'Установить флаг переноса (CF=1)',
  },
  {
    name: 'SUB A',
    code: 0x97,
    description: 'Вычесть А из А (очистить А)',
  },
  {
    name: 'SUB B',
    code: 0x90,
    description: 'Вычесть B из А',
  },
  {
    name: 'SUB C',
    code: 0x91,
    description: 'Вычесть C из А',
  },
  {
    name: 'SUB D',
    code: 0x92,
    description: 'Вычесть D из А',
  },
  {
    name: 'SUB E',
    code: 0x93,
    description: 'Вычесть E из А',
  },
  {
    name: 'SUB H',
    code: 0x94,
    description: 'Вычесть H из А',
  },
  {
    name: 'SUB L',
    code: 0x95,
    description: 'Вычесть L из А',
  },
  {
    name: 'SUB M',
    code: 0x96,
    description: 'Вычесть M из А',
  },
  {
    name: 'SUI d8',
    code: 0xD6,
    description: 'Вычесть d8 из А',
  },
  {
    name: 'SBB A',
    code: 0x9F,
    description: 'Вычесть А из А (очистить А)',
  },
  {
    name: 'SBB B',
    code: 0x98,
    description: 'Вычесть c заёмом B из А',
  },
  {
    name: 'SBB C',
    code: 0x99,
    description: 'Вычесть c заёмом C из А',
  },
  {
    name: 'SBB D',
    code: 0x9A,
    description: 'Вычесть c заёмом D из А',
  },
  {
    name: 'SBB E',
    code: 0x9B,
    description: 'Вычесть c заёмом E из А',
  },
  {
    name: 'SBB H',
    code: 0x9C,
    description: 'Вычесть c заёмом H из А',
  },
  {
    name: 'SBB L',
    code: 0x9D,
    description: 'Вычесть c заёмом L из А',
  },
  {
    name: 'SBB M',
    code: 0x9E,
    description: 'Вычесть c заёмом M из А',
  },
  {
    name: 'SBI d8',
    code: 0xDE,
    description: 'Вычесть c заемом d8 из А',
  },
  {
    name: 'XCHG',
    code: 0xEB,
    description: 'Обмен содержимым DE и HL',
  },
  {
    name: 'XTHL',
    code: 0xE3,
    description: 'Обмен содержимого вершины стека с содержимым HL',
  },
  {
    name: 'XRA A',
    code: 0xAF,
    description: 'Исключающее ИЛИ A с A (очистка A)',
  },
  {
    name: 'XRA B',
    code: 0xA8,
    description: 'Исключающее ИЛИ B с A',
  },
  {
    name: 'XRA C',
    code: 0xA9,
    description: 'Исключающее ИЛИ C с A',
  },
  {
    name: 'XRA D',
    code: 0xAA,
    description: 'Исключающее ИЛИ D с A',
  },
  {
    name: 'XRA E',
    code: 0xAB,
    description: 'Исключающее ИЛИ E с A',
  },
  {
    name: 'XRA H',
    code: 0xAC,
    description: 'Исключающее ИЛИ H с A',
  },
  {
    name: 'XRA L',
    code: 0xAD,
    description: 'Исключающее ИЛИ L с A',
  },
  {
    name: 'XRA M',
    code: 0xAE,
    description: 'Исключающее ИЛИ Loc(HL) с A',
  },
  {
    name: 'XRI d8',
    code: 0xEE,
    description: 'Исключающее ИЛИ d8 с A',
  },
] as DocIntel8080Command[]).sort((a, b) => a.code - b.code)
