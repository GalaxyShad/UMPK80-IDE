
type Regm = 'A'| 'B'| 'C'| 'D' | 'E' | 'H'| 'L' | 'M';
type Rp = 'B' | 'D' | 'H' | 'SP' | 'PSW';
type Argument = 'DATA' | 'DATA16' | 'RP' | 'REGM';

type ConditionBit = 'Carry' | 'Sign' | 'Zero' | 'Parity' | 'Aux. Carry';

interface InstructionDocumentation {
  name: string,
  arguments: Argument[],
  code: number | Record<Rp | Regm, number>,
  scheme: string | string[],
  description: string,
  conditionBitsAffected: ConditionBit[]
}

// TODO
const instructionDocumentationJson = [
  {
    name: "STC",
    arguments: [],
    code: 0x37,
    scheme: "(Carry) <- 1",
    description: "Set carry",
    conditionBitsAffected: ['Carry']
  },
  {
    name: "ADD",
    arguments: ["REGM"],
    code: {
      "A": 0x87,
      'B': 0x80,
      'C': 0x81,
      'D': 0x82,
      'E': 0x83,
      'H': 0x84,
      'L': 0x85,
      'M': 0x86,
    },
    scheme: "(A) <- (A)+(REGM)",
    description: "Set carry",
    conditionBitsAffected: ['Carry', 'Sign', 'Zero', 'Parity', 'Aux. Carry']
  }
] as InstructionDocumentation[];