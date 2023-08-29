
//
//	Adressing Mode
//

const ADM_IMP = 0;
const ADM_R_D16 = 1;
const ADM_R_R = 2;
const ADM_MR_R = 3;
const ADM_R = 4;
const ADM_R_D8 = 5;
const ADM_R_MR = 6;
const ADM_R_HLI = 7;
const ADM_R_HLD = 8;
const ADM_HLI_R = 9;
const ADM_HLD_R = 10;
const ADM_R_A8 = 11;
const ADM_A8_R = 12;
const ADM_HL_SPR = 13;
const ADM_D16 = 14;
const ADM_D8 = 15;
const ADM_D16_R = 16;
const ADM_MR_D8 = 17;
const ADM_MR = 18;
const ADM_A16_R = 19;
const ADM_R_A16 = 20;


//
//	Register Type
//

const RT_NONE = -1;
const RT_A = 0 ^ LITTLE_ENDIAN;
const RT_F = 1 ^ LITTLE_ENDIAN;
const RT_B = 2 ^ LITTLE_ENDIAN;
const RT_C = 3 ^ LITTLE_ENDIAN;
const RT_D = 4 ^ LITTLE_ENDIAN;
const RT_E = 5 ^ LITTLE_ENDIAN;
const RT_H = 6 ^ LITTLE_ENDIAN;
const RT_L = 7 ^ LITTLE_ENDIAN;
const RT_AF = 8;
const RT_BC = 9;
const RT_DE = 10;
const RT_HL = 11;
const RT_SP = 12;
const RT_PC = 13;

const RT_LOOKUP_NAMES = [];
RT_LOOKUP_NAMES[RT_A] = "A";
RT_LOOKUP_NAMES[RT_F] = "F";
RT_LOOKUP_NAMES[RT_B] = "B";
RT_LOOKUP_NAMES[RT_C] = "C";
RT_LOOKUP_NAMES[RT_D] = "D";
RT_LOOKUP_NAMES[RT_E] = "E";
RT_LOOKUP_NAMES[RT_H] = "H";
RT_LOOKUP_NAMES[RT_L] = "L";
RT_LOOKUP_NAMES[RT_AF] = "AF";
RT_LOOKUP_NAMES[RT_BC] = "BC";
RT_LOOKUP_NAMES[RT_DE] = "DE";
RT_LOOKUP_NAMES[RT_HL] = "HL";
RT_LOOKUP_NAMES[RT_SP] = "SP";
RT_LOOKUP_NAMES[RT_PC] = "PC";

const EX_RT_LOOKUP = [
	RT_B,
	RT_C,
	RT_D,
	RT_E,
	RT_H,
	RT_L,
	RT_HL,
	RT_A
];


//
//	Instruction Type
//

const IN_NONE = 0;
const IN_NOP = 1;
const IN_LD = 2;
const IN_INC = 3;
const IN_DEC = 4;
const IN_RLCA = 5;
const IN_ADD = 6;
const IN_RRCA = 7;
const IN_STOP = 8;
const IN_RLA = 9;
const IN_JR = 10;
const IN_RRA = 11;
const IN_DAA = 12;
const IN_CPL = 13;
const IN_SCF = 14;
const IN_CCF = 15;
const IN_HALT = 16;
const IN_ADC = 17;
const IN_SUB = 18;
const IN_SBC = 19;
const IN_AND = 20;
const IN_XOR = 21;
const IN_OR = 22;
const IN_CP = 23;
const IN_POP = 24;
const IN_JP = 25;
const IN_PUSH = 26;
const IN_RET = 27;
const IN_CB = 28;
const IN_CALL = 29;
const IN_RETI = 30;
const IN_LDH = 31;
const IN_JPHL = 32;
const IN_DI = 33;
const IN_EI = 34;
const IN_RST = 35;
const IN_ERR = 36;
// CB Instructions
const IN_RLC = 37;
const IN_RRC = 38;
const IN_RL = 39;
const IN_RR = 40;
const IN_SLA = 41;
const IN_SRA = 42;
const IN_SWAP = 43;
const IN_SRL = 44;
const IN_BIT = 45;
const IN_RES = 46;
const IN_SET = 47;

const IN_LOOKUP_NAME = [
	"<NONE>", "NOP", "LD", "INC", "DEC",
	"RLCA", "ADD", "RRCA", "STOP", "RLA",
	
	"JR", "RRA", "DAA", "CPL", "SCF",
	"CCF", "HALT", "ADC", "SUB", "SBC",
	
	"AND", "XOR", "OR", "CP", "POP",
	"JP", "PUSH", "RET", "CB", "CALL",
	
	"RETI", "LDH", "JPHL", "DI", "EI",
	"RST", "ERR", "RLC", "RRC", "RL",
	
	"RR", "SLA", "SRA", "SWAP", "SRL",
	"BIT", "RES", "SET"
];


//
//	Condition Type
//

const CT_NONE = 0;
const CT_NZ = 1;
const CT_Z = 2;
const CT_NC = 3;
const CT_C = 4;


//
//	Instruction Table
//

function Instruction(in_type=IN_NONE, adrm=ADM_IMP, reg1=RT_NONE, reg2=RT_NONE, ct=CT_NONE, param=0) {
	var self = this;
	self.in_type = in_type;
	self.adrm = adrm;
	self.reg1 = reg1;
	self.reg2 = reg2;
	self.ct = ct;
	self.param = param;
}

let instructions = [
	// 0x00
	new Instruction(IN_NOP, ADM_IMP),
	new Instruction(IN_LD, ADM_R_D16, RT_BC),
	new Instruction(IN_LD, ADM_MR_R, RT_BC, RT_A),
	new Instruction(IN_INC, ADM_R, RT_BC),
	new Instruction(IN_INC, ADM_R, RT_B),
	new Instruction(IN_DEC, ADM_R, RT_B),
	new Instruction(IN_LD, ADM_R_D8, RT_B),
	new Instruction(IN_RLCA),
	
	// 0x08
	new Instruction(IN_LD, ADM_A16_R, RT_NONE, RT_SP),
	new Instruction(IN_ADD, ADM_R_R, RT_HL, RT_BC),
	new Instruction(IN_LD, ADM_R_MR, RT_A, RT_BC),
	new Instruction(IN_DEC, ADM_R, RT_BC),
	new Instruction(IN_INC, ADM_R, RT_C),
	new Instruction(IN_DEC, ADM_R, RT_C),
	new Instruction(IN_LD, ADM_R_D8, RT_C),
	new Instruction(IN_RRCA),
	
	// 0x10
	new Instruction(IN_STOP),
	new Instruction(IN_LD, ADM_R_D16, RT_DE),
	new Instruction(IN_LD, ADM_MR_R, RT_DE, RT_A),
	new Instruction(IN_INC, ADM_R, RT_DE),
	new Instruction(IN_INC, ADM_R, RT_D),
	new Instruction(IN_DEC, ADM_R, RT_D),
	new Instruction(IN_LD, ADM_R_D8, RT_D),
	new Instruction(IN_RLA),
	
	// 0x18
	new Instruction(IN_JR, ADM_D8),
	new Instruction(IN_ADD, ADM_R_R, RT_HL, RT_DE),
	new Instruction(IN_LD, ADM_R_MR, RT_A, RT_DE),
	new Instruction(IN_DEC, ADM_R, RT_DE),
	new Instruction(IN_INC, ADM_R, RT_E),
	new Instruction(IN_DEC, ADM_R, RT_E),
	new Instruction(IN_LD, ADM_R_D8, RT_E),
	new Instruction(IN_RRA),
	
	// 0x20
	new Instruction(IN_JR, ADM_D8, RT_NONE, RT_NONE, CT_NZ),
	new Instruction(IN_LD, ADM_R_D16, RT_HL),
	new Instruction(IN_LD, ADM_HLI_R, RT_HL, RT_A),
	new Instruction(IN_INC, ADM_R, RT_HL),
	new Instruction(IN_INC, ADM_R, RT_H),
	new Instruction(IN_DEC, ADM_R, RT_H),
	new Instruction(IN_LD, ADM_R_D8, RT_H),
	new Instruction(IN_DAA),
	
	// 0x28
	new Instruction(IN_JR, ADM_D8, RT_NONE, RT_NONE, CT_Z),
	new Instruction(IN_ADD, ADM_R_R, RT_HL, RT_HL),
	new Instruction(IN_LD, ADM_R_HLI, RT_A, RT_HL),
	new Instruction(IN_DEC, ADM_R, RT_HL),
	new Instruction(IN_INC, ADM_R, RT_L),
	new Instruction(IN_DEC, ADM_R, RT_L),
	new Instruction(IN_LD, ADM_R_D8, RT_L),
	new Instruction(IN_CPL),
	
	// 0x30
	new Instruction(IN_JR, ADM_D8, RT_NONE, RT_NONE, CT_NC),
	new Instruction(IN_LD, ADM_R_D16, RT_SP),
	new Instruction(IN_LD, ADM_HLD_R, RT_HL, RT_A),
	new Instruction(IN_INC, ADM_R, RT_SP),
	new Instruction(IN_INC, ADM_MR, RT_HL),
	new Instruction(IN_DEC, ADM_MR, RT_HL),
	new Instruction(IN_LD, ADM_MR_D8, RT_HL),
	new Instruction(IN_SCF),
	
	// 0x38
	new Instruction(IN_JR, ADM_D8, RT_NONE, RT_NONE, CT_C),
	new Instruction(IN_ADD, ADM_R_R, RT_HL, RT_SP),
	new Instruction(IN_LD, ADM_R_HLD, RT_A, RT_HL),
	new Instruction(IN_DEC, ADM_R, RT_SP),
	new Instruction(IN_INC, ADM_R, RT_A),
	new Instruction(IN_DEC, ADM_R, RT_A),
	new Instruction(IN_LD, ADM_R_D8, RT_A),
	new Instruction(IN_CCF),
	
	// 0x40
	new Instruction(IN_LD, ADM_R_R, RT_B, RT_B),
	new Instruction(IN_LD, ADM_R_R, RT_B, RT_C),
	new Instruction(IN_LD, ADM_R_R, RT_B, RT_D),
	new Instruction(IN_LD, ADM_R_R, RT_B, RT_E),
	new Instruction(IN_LD, ADM_R_R, RT_B, RT_H),
	new Instruction(IN_LD, ADM_R_R, RT_B, RT_L),
	new Instruction(IN_LD, ADM_R_MR, RT_B, RT_HL),
	new Instruction(IN_LD, ADM_R_R, RT_B, RT_A),
	
	// 0x48
	new Instruction(IN_LD, ADM_R_R, RT_C, RT_B),
	new Instruction(IN_LD, ADM_R_R, RT_C, RT_C),
	new Instruction(IN_LD, ADM_R_R, RT_C, RT_D),
	new Instruction(IN_LD, ADM_R_R, RT_C, RT_E),
	new Instruction(IN_LD, ADM_R_R, RT_C, RT_H),
	new Instruction(IN_LD, ADM_R_R, RT_C, RT_L),
	new Instruction(IN_LD, ADM_R_MR, RT_C, RT_HL),
	new Instruction(IN_LD, ADM_R_R, RT_C, RT_A),
	
	// 0x50
	new Instruction(IN_LD, ADM_R_R, RT_D, RT_B),
	new Instruction(IN_LD, ADM_R_R, RT_D, RT_C),
	new Instruction(IN_LD, ADM_R_R, RT_D, RT_D),
	new Instruction(IN_LD, ADM_R_R, RT_D, RT_E),
	new Instruction(IN_LD, ADM_R_R, RT_D, RT_H),
	new Instruction(IN_LD, ADM_R_R, RT_D, RT_L),
	new Instruction(IN_LD, ADM_R_MR, RT_D, RT_HL),
	new Instruction(IN_LD, ADM_R_R, RT_D, RT_A),
	
	// 0x58
	new Instruction(IN_LD, ADM_R_R, RT_E, RT_B),
	new Instruction(IN_LD, ADM_R_R, RT_E, RT_C),
	new Instruction(IN_LD, ADM_R_R, RT_E, RT_D),
	new Instruction(IN_LD, ADM_R_R, RT_E, RT_E),
	new Instruction(IN_LD, ADM_R_R, RT_E, RT_H),
	new Instruction(IN_LD, ADM_R_R, RT_E, RT_L),
	new Instruction(IN_LD, ADM_R_MR, RT_E, RT_HL),
	new Instruction(IN_LD, ADM_R_R, RT_E, RT_A),
	
	// 0x60
	new Instruction(IN_LD, ADM_R_R, RT_H, RT_B),
	new Instruction(IN_LD, ADM_R_R, RT_H, RT_C),
	new Instruction(IN_LD, ADM_R_R, RT_H, RT_D),
	new Instruction(IN_LD, ADM_R_R, RT_H, RT_E),
	new Instruction(IN_LD, ADM_R_R, RT_H, RT_H),
	new Instruction(IN_LD, ADM_R_R, RT_H, RT_L),
	new Instruction(IN_LD, ADM_R_MR, RT_H, RT_HL),
	new Instruction(IN_LD, ADM_R_R, RT_H, RT_A),
	
	// 0x68
	new Instruction(IN_LD, ADM_R_R, RT_L, RT_B),
	new Instruction(IN_LD, ADM_R_R, RT_L, RT_C),
	new Instruction(IN_LD, ADM_R_R, RT_L, RT_D),
	new Instruction(IN_LD, ADM_R_R, RT_L, RT_E),
	new Instruction(IN_LD, ADM_R_R, RT_L, RT_H),
	new Instruction(IN_LD, ADM_R_R, RT_L, RT_L),
	new Instruction(IN_LD, ADM_R_MR, RT_L, RT_HL),
	new Instruction(IN_LD, ADM_R_R, RT_L, RT_A),
	
	// 0x70
	new Instruction(IN_LD, ADM_MR_R, RT_HL, RT_B),
	new Instruction(IN_LD, ADM_MR_R, RT_HL, RT_C),
	new Instruction(IN_LD, ADM_MR_R, RT_HL, RT_D),
	new Instruction(IN_LD, ADM_MR_R, RT_HL, RT_E),
	new Instruction(IN_LD, ADM_MR_R, RT_HL, RT_H),
	new Instruction(IN_LD, ADM_MR_R, RT_HL, RT_L),
	new Instruction(IN_HALT),
	new Instruction(IN_LD, ADM_MR_R, RT_HL, RT_A),
	
	// 0x78
	new Instruction(IN_LD, ADM_R_R, RT_A, RT_B),
	new Instruction(IN_LD, ADM_R_R, RT_A, RT_C),
	new Instruction(IN_LD, ADM_R_R, RT_A, RT_D),
	new Instruction(IN_LD, ADM_R_R, RT_A, RT_E),
	new Instruction(IN_LD, ADM_R_R, RT_A, RT_H),
	new Instruction(IN_LD, ADM_R_R, RT_A, RT_L),
	new Instruction(IN_LD, ADM_R_MR, RT_A, RT_HL),
	new Instruction(IN_LD, ADM_R_R, RT_A, RT_A),
	
	// 0x80
	new Instruction(IN_ADD, ADM_R_R, RT_A, RT_B),
	new Instruction(IN_ADD, ADM_R_R, RT_A, RT_C),
	new Instruction(IN_ADD, ADM_R_R, RT_A, RT_D),
	new Instruction(IN_ADD, ADM_R_R, RT_A, RT_E),
	new Instruction(IN_ADD, ADM_R_R, RT_A, RT_H),
	new Instruction(IN_ADD, ADM_R_R, RT_A, RT_L),
	new Instruction(IN_ADD, ADM_R_MR, RT_A, RT_HL),
	new Instruction(IN_ADD, ADM_R_R, RT_A, RT_A),
	
	// 0x88
	new Instruction(IN_ADC, ADM_R_R, RT_A, RT_B),
	new Instruction(IN_ADC, ADM_R_R, RT_A, RT_C),
	new Instruction(IN_ADC, ADM_R_R, RT_A, RT_D),
	new Instruction(IN_ADC, ADM_R_R, RT_A, RT_E),
	new Instruction(IN_ADC, ADM_R_R, RT_A, RT_H),
	new Instruction(IN_ADC, ADM_R_R, RT_A, RT_L),
	new Instruction(IN_ADC, ADM_R_MR, RT_A, RT_HL),
	new Instruction(IN_ADC, ADM_R_R, RT_A, RT_A),
	
	// 0x90
	new Instruction(IN_SUB, ADM_R_R, RT_A, RT_B),
	new Instruction(IN_SUB, ADM_R_R, RT_A, RT_C),
	new Instruction(IN_SUB, ADM_R_R, RT_A, RT_D),
	new Instruction(IN_SUB, ADM_R_R, RT_A, RT_E),
	new Instruction(IN_SUB, ADM_R_R, RT_A, RT_H),
	new Instruction(IN_SUB, ADM_R_R, RT_A, RT_L),
	new Instruction(IN_SUB, ADM_R_MR, RT_A, RT_HL),
	new Instruction(IN_SUB, ADM_R_R, RT_A, RT_A),
	
	// 0x98
	new Instruction(IN_SBC, ADM_R_R, RT_A, RT_B),
	new Instruction(IN_SBC, ADM_R_R, RT_A, RT_C),
	new Instruction(IN_SBC, ADM_R_R, RT_A, RT_D),
	new Instruction(IN_SBC, ADM_R_R, RT_A, RT_E),
	new Instruction(IN_SBC, ADM_R_R, RT_A, RT_H),
	new Instruction(IN_SBC, ADM_R_R, RT_A, RT_L),
	new Instruction(IN_SBC, ADM_R_MR, RT_A, RT_HL),
	new Instruction(IN_SBC, ADM_R_R, RT_A, RT_A),
	
	// 0xA0
	new Instruction(IN_AND, ADM_R_R, RT_A, RT_B),
	new Instruction(IN_AND, ADM_R_R, RT_A, RT_C),
	new Instruction(IN_AND, ADM_R_R, RT_A, RT_D),
	new Instruction(IN_AND, ADM_R_R, RT_A, RT_E),
	new Instruction(IN_AND, ADM_R_R, RT_A, RT_H),
	new Instruction(IN_AND, ADM_R_R, RT_A, RT_L),
	new Instruction(IN_AND, ADM_R_MR, RT_A, RT_HL),
	new Instruction(IN_AND, ADM_R_R, RT_A, RT_A),
	
	// 0xA8
	new Instruction(IN_XOR, ADM_R_R, RT_A, RT_B),
	new Instruction(IN_XOR, ADM_R_R, RT_A, RT_C),
	new Instruction(IN_XOR, ADM_R_R, RT_A, RT_D),
	new Instruction(IN_XOR, ADM_R_R, RT_A, RT_E),
	new Instruction(IN_XOR, ADM_R_R, RT_A, RT_H),
	new Instruction(IN_XOR, ADM_R_R, RT_A, RT_L),
	new Instruction(IN_XOR, ADM_R_MR, RT_A, RT_HL),
	new Instruction(IN_XOR, ADM_R_R, RT_A, RT_A),
	
	// 0xB0
	new Instruction(IN_OR, ADM_R_R, RT_A, RT_B),
	new Instruction(IN_OR, ADM_R_R, RT_A, RT_C),
	new Instruction(IN_OR, ADM_R_R, RT_A, RT_D),
	new Instruction(IN_OR, ADM_R_R, RT_A, RT_E),
	new Instruction(IN_OR, ADM_R_R, RT_A, RT_H),
	new Instruction(IN_OR, ADM_R_R, RT_A, RT_L),
	new Instruction(IN_OR, ADM_R_MR, RT_A, RT_HL),
	new Instruction(IN_OR, ADM_R_R, RT_A, RT_A),
	
	// 0xB8
	new Instruction(IN_CP, ADM_R_R, RT_A, RT_B),
	new Instruction(IN_CP, ADM_R_R, RT_A, RT_C),
	new Instruction(IN_CP, ADM_R_R, RT_A, RT_D),
	new Instruction(IN_CP, ADM_R_R, RT_A, RT_E),
	new Instruction(IN_CP, ADM_R_R, RT_A, RT_H),
	new Instruction(IN_CP, ADM_R_R, RT_A, RT_L),
	new Instruction(IN_CP, ADM_R_MR, RT_A, RT_HL),
	new Instruction(IN_CP, ADM_R_R, RT_A, RT_A),
	
	// 0xC0
	new Instruction(IN_RET, ADM_IMP, RT_NONE, RT_NONE, CT_NZ),
	new Instruction(IN_POP, ADM_R, RT_BC),
	new Instruction(IN_JP, ADM_D16, RT_NONE, RT_NONE, CT_NZ),
	new Instruction(IN_JP, ADM_D16),
	new Instruction(IN_CALL, ADM_D16, RT_NONE, RT_NONE, CT_NZ),
	new Instruction(IN_PUSH, ADM_R, RT_BC),
	new Instruction(IN_ADD, ADM_R_D8, RT_A),
	new Instruction(IN_RST, ADM_IMP, RT_NONE, RT_NONE, CT_NONE, 0x00),
	
	// 0xC8
	new Instruction(IN_RET, ADM_IMP, RT_NONE, RT_NONE, CT_Z),
	new Instruction(IN_RET),
	new Instruction(IN_JP, ADM_D16, RT_NONE, RT_NONE, CT_Z),
	new Instruction(IN_CB, ADM_D8),
	new Instruction(IN_CALL, ADM_D16, RT_NONE, RT_NONE, CT_Z),
	new Instruction(IN_CALL, ADM_D16),
	new Instruction(IN_ADC, ADM_R_D8, RT_A),
	new Instruction(IN_RST, ADM_IMP, RT_NONE, RT_NONE, CT_NONE, 0x08),
	
	// 0xD0
	new Instruction(IN_RET, ADM_IMP, RT_NONE, RT_NONE, CT_NC),
	new Instruction(IN_POP, ADM_R, RT_DE),
	new Instruction(IN_JP, ADM_D16, RT_NONE, RT_NONE, CT_NC),
	null, // Empty
	new Instruction(IN_CALL, ADM_D16, RT_NONE, RT_NONE, CT_NC),
	new Instruction(IN_PUSH, ADM_R, RT_DE),
	new Instruction(IN_SUB, ADM_R_D8, RT_A),
	new Instruction(IN_RST, ADM_IMP, RT_NONE, RT_NONE, CT_NONE, 0x10),
	
	// 0xD8
	new Instruction(IN_RET, ADM_IMP, RT_NONE, RT_NONE, CT_C),
	new Instruction(IN_RETI),
	new Instruction(IN_JP, ADM_D16, RT_NONE, RT_NONE, CT_C),
	null, // Empty
	new Instruction(IN_CALL, ADM_D16, RT_NONE, RT_NONE, CT_C),
	null, // Empty
	new Instruction(IN_SBC, ADM_R_D8, RT_A),
	new Instruction(IN_RST, ADM_IMP, RT_NONE, RT_NONE, CT_NONE, 0x18),
	
	// 0xE0
	new Instruction(IN_LDH, ADM_A8_R, RT_NONE, RT_A),
	new Instruction(IN_POP, ADM_R, RT_HL),
	new Instruction(IN_LD, ADM_MR_R, RT_C, RT_A),
	null, // Empty
	null, // Empty
	new Instruction(IN_PUSH, ADM_R, RT_HL),
	new Instruction(IN_AND, ADM_R_D8, RT_A),
	new Instruction(IN_RST, ADM_IMP, RT_NONE, RT_NONE, CT_NONE, 0x20),
	
	// 0xE8
	new Instruction(IN_ADD, ADM_R_D8, RT_SP),
	new Instruction(IN_JP, ADM_R, RT_HL),
	new Instruction(IN_LD, ADM_A16_R, RT_NONE, RT_A),
	null, // Empty
	null, // Empty
	null, // Empty
	new Instruction(IN_XOR, ADM_R_D8, RT_A),
	new Instruction(IN_RST, ADM_IMP, RT_NONE, RT_NONE, CT_NONE, 0x28),
	
	// 0xF0
	new Instruction(IN_LDH, ADM_R_A8, RT_A),
	new Instruction(IN_POP, ADM_R, RT_AF),
	new Instruction(IN_LD, ADM_R_MR, RT_A, RT_C),
	new Instruction(IN_DI),
	null, // Empty
	new Instruction(IN_PUSH, ADM_R, RT_AF),
	new Instruction(IN_OR, ADM_R_D8, RT_A),
	new Instruction(IN_RST, ADM_IMP, RT_NONE, RT_NONE, CT_NONE, 0x30),
	
	// 0xF8
	new Instruction(IN_LD, ADM_HL_SPR, RT_HL, RT_SP),
	new Instruction(IN_LD, ADM_R_R, RT_SP, RT_HL),
	new Instruction(IN_LD, ADM_R_A16, RT_A),
	new Instruction(IN_EI),
	null, // Empty
	null, // Empty
	new Instruction(IN_CP, ADM_R_D8, RT_A),
	new Instruction(IN_RST, ADM_IMP, RT_NONE, RT_NONE, CT_NONE, 0x38)
];


//
//	Instruction Stringify
//

function instructionToString() {
	let instr = cpu_instruction;
	let str = IN_LOOKUP_NAME[instr.in_type].toUpperCase();
	
	switch (instr.adrm){
		case ADM_IMP: return str;
		
		case ADM_R_D16:
		case ADM_R_A16: {
			str += " "+RT_LOOKUP_NAMES[instr.reg1]+", $0x"+(busRead(cpu_reg_pc-2)|(busRead(cpu_reg_pc-1)<<8)).toString(16).toUpperCase();
			return str;
		}
		
		case ADM_R: {
			str += " "+RT_LOOKUP_NAMES[instr.reg1];
			return str;
		}
		
		case ADM_R_R: {
			str += " "+RT_LOOKUP_NAMES[instr.reg1]+", "+RT_LOOKUP_NAMES[instr.reg2];
			return str;
		}
		
		case ADM_MR_R: {
			str += " ("+RT_LOOKUP_NAMES[instr.reg1]+"), "+RT_LOOKUP_NAMES[instr.reg2];
			return str;
		}
		
		case ADM_MR: {
			str += " ("+RT_LOOKUP_NAMES[instr.reg1]+")";
			return str;
		}
		
		case ADM_R_MR: {
			str += " "+RT_LOOKUP_NAMES[instr.reg1]+", ("+RT_LOOKUP_NAMES[instr.reg2]+")";
			return str;
		}
		
		case ADM_R_A8:
		case ADM_R_D8: {
			str += " "+RT_LOOKUP_NAMES[instr.reg1]+", $0x"+(busRead(cpu_reg_pc-1)).toString(16).toUpperCase();
			return str;
		}
		
		case ADM_R_HLI: {
			str += " "+RT_LOOKUP_NAMES[instr.reg1]+", ("+RT_LOOKUP_NAMES[instr.reg2]+"+)";
			return str;
		}
		
		case ADM_R_HLD: {
			str += " "+RT_LOOKUP_NAMES[instr.reg1]+", ("+RT_LOOKUP_NAMES[instr.reg2]+"-)";
			return str;
		}
		
		case ADM_HLI_R: {
			str += " ("+RT_LOOKUP_NAMES[instr.reg1]+"+), "+RT_LOOKUP_NAMES[instr.reg2];
			return str;
		}
		
		case ADM_HLD_R: {
			str += " ("+RT_LOOKUP_NAMES[instr.reg1]+"-), "+RT_LOOKUP_NAMES[instr.reg2];
			return str;
		}
		
		case ADM_A8_R: {
			str += " $0x"+busRead(cpu_reg_pc-1).toString(16).toUpperCase()+", "+RT_LOOKUP_NAMES[instr.reg2];
			return str;
		}
		
		case ADM_HL_SPR: {
			str += " ("+RT_LOOKUP_NAMES[instr.reg1]+"), SP+"+(RT_LOOKUP_NAMES[instr.reg2]&0xFF);
			return str;
		}
		
		case ADM_D8: {
			str += " $0x"+(busRead(cpu_reg_pc-1)).toString(16).toUpperCase();
			return str;
		}
		
		case ADM_D16: {
			str += " $0x"+(busRead(cpu_reg_pc-2)|(busRead(cpu_reg_pc-1)<<8)).toString(16).toUpperCase();
			return str;
		}
		
		case ADM_MR_D8: {
			str += " ("+RT_LOOKUP_NAMES[instr.reg1]+"), $0x"+((busRead(cpu_reg_pc-1))&0xFF).toString(16).toUpperCase();
			return str;
		}
		
		case ADM_A16_R: {
			str += " ($0x"+(busRead(cpu_reg_pc-2)|(busRead(cpu_reg_pc-1)<<8)).toString(16).toUpperCase()+"), "+RT_LOOKUP_NAMES[instr.reg2];
			return str;
		}
	}
	return "<INVALID>"+str;
}
