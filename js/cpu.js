
//
//	CPU Properties
//

let cpu_regs = new Uint8Array(12);
let cpu_regs16 = new Uint16Array(cpu_regs.buffer);
let cpu_reg_pc = 0x0;
let cpu_reg_sp = 0x0;
let cpu_reg_ie = 0x0;

let cpu_fetched_data = 0x0;
let cpu_instruction = null;
let cpu_memory_dest = 0x0;
let cpu_dest_is_memory = false;
let cpu_current_opcode = 0x0;
let cpu_halted = true;
let cpu_stepping = false;

let cpu_int_flags = 0x0;
let cpu_enabling_ime = false;
let cpu_interrupt_master_enabled = false;

const CPU_FLAG_Z = 7;
const CPU_FLAG_N = 6;
const CPU_FLAG_H = 5;
const CPU_FLAG_C = 4;


//
//	CPU Accesses
//

function cpuReadReg(reg) {
	if (reg < RT_AF){
		return cpu_regs[reg];
	}
	if (reg < RT_SP){
		return cpu_regs16[reg - RT_AF];
	}
	if (reg == RT_SP){
		return cpu_reg_sp;
	}
	return cpu_reg_pc;
}

function cpuWriteReg(reg, data) {
	if (reg < RT_AF){
		cpu_regs[reg] = data;
		return;
	}
	if (reg < RT_SP){
		cpu_regs16[reg - RT_AF] = data;
		return;
	}
	if (reg == RT_SP){
		cpu_reg_sp = data;
		return;
	}
	cpu_reg_pc;
}

function cpuReadReg(reg) {
	if (reg < RT_AF){
		return cpu_regs[reg];
	}
	if (reg < RT_SP){
		return cpu_regs16[reg - RT_AF];
	}
	if (reg == RT_SP){
		return cpu_reg_sp;
	}
	return cpu_reg_pc;
}

function cpuWriteReg(reg, data) {
	if (reg < RT_AF){
		cpu_regs[reg] = data;
		return;
	}
	if (reg < RT_SP){
		cpu_regs16[reg - RT_AF] = data;
		return;
	}
	if (reg == RT_SP){
		cpu_reg_sp = data;
		return;
	}
	cpu_reg_pc;
}

function cpuCBReadReg(reg) {
	if (reg == RT_HL){
		return busRead(cpu_regs16[RT_HL-RT_AF]);
	}
	if (reg < RT_AF){
		return cpu_regs[reg];
	}
	notImplemented("Read from NON 8-bit Registers");
	return 0x0;
}

function cpuCBWriteReg(reg, data) {
	if (reg == RT_HL){
		busWrite(cpu_regs16[RT_HL-RT_AF], data);
		return;
	}
	if (reg < RT_AF){
		cpu_regs[reg] = data;
		return;
	}
	notImplemented("Write to NON 8-bit Registers");
}

//
//	CPU Internal Functions
//

function cpuFetchInstruction() {
	cpu_current_opcode = busRead(cpu_reg_pc);
	cpu_instruction = instructions[cpu_current_opcode];
	cpu_reg_pc++;
	
	if (!cpu_instruction){
		notImplemented("Instruction with Opcode 0x"+cpu_current_opcode.toString(16).toUpperCase());
	}
}

function cpuExecute() {
	let proc = processors[cpu_instruction.in_type];
	if (!proc){
		notImplemented("Processor "+cpu_instruction.in_type);
	}
	proc();
}


//
//	CPU Control Functions
//

function cpuInit() {
	cpuWriteReg(RT_A, 0x01);
	cpuWriteReg(RT_F, 0xB0);
	cpuWriteReg(RT_B, 0x00);
	cpuWriteReg(RT_C, 0x13);
	cpuWriteReg(RT_D, 0x00);
	cpuWriteReg(RT_E, 0xD8);
	cpuWriteReg(RT_H, 0x01);
	cpuWriteReg(RT_L, 0x4D);
	cpu_reg_sp = 0xFFFE;
	cpu_reg_pc = 0x100;
	cpu_reg_ie = 0x0;
	cpu_int_flags = 0x0;
	cpu_interrupt_master_enabled = false;
	cpu_enabling_ime = false;
	
	cpu_halted = false;
}

function cpuStep(log=false) {
	if (!cpu_halted){
		let pc = cpu_reg_pc;
		
		//LOG("");
		cpuFetchInstruction();
		emuCycles(1);
		cpuFetchData();
		
		if (log){
			LOG("PC 0x"+pc.toString(16).toUpperCase()+": "+instructionToString()+"    (0x"+
				busRead(pc).toString(16).toUpperCase()+", 0x"+
				busRead(pc+1).toString(16).toUpperCase()+", 0x"+
				busRead(pc+2).toString(16).toUpperCase()+")");
			LOG("A: 0x"+cpuReadReg(RT_A).toString(16).toUpperCase()+
				"; F: 0x"+cpuReadReg(RT_F).toString(16).toUpperCase()+ "["+(bitGet(cpuReadReg(RT_F), CPU_FLAG_Z)?'Z':'-')+(bitGet(cpuReadReg(RT_F), CPU_FLAG_N)?'N':'-')+(bitGet(cpuReadReg(RT_F), CPU_FLAG_H)?'H':'-')+(bitGet(cpuReadReg(RT_F), CPU_FLAG_C)?'C':'-')+"]"+
				"; B: 0x"+cpuReadReg(RT_B).toString(16).toUpperCase()+
				"; C: 0x"+cpuReadReg(RT_C).toString(16).toUpperCase()+
				"; D: 0x"+cpuReadReg(RT_D).toString(16).toUpperCase()+
				"; E: 0x"+cpuReadReg(RT_E).toString(16).toUpperCase()+
				"; H: 0x"+cpuReadReg(RT_H).toString(16).toUpperCase()+
				"; L: 0x"+cpuReadReg(RT_L).toString(16).toUpperCase());
			let stack = "Stack 0x"+cpu_reg_sp.toString(16).toUpperCase();
			try{
				stack += ": ";
				for (let i=0; i<8; i++){
					stack += "0x"+busRead(cpu_reg_sp + i).toString(16).toUpperCase() + (i==7?"":", ");
				}
			} catch(e){}
			LOG(stack);
		}
		
		dbgUpdate();
		dbgPrint();
		
		cpuExecute();
	}
	else {
		emuCycles(1);
		
		if (cpu_int_flags){
			cpu_halted = false;
		}
	}
	
	if (cpu_interrupt_master_enabled){
		cpuHandleInterrupts();
		cpu_enabling_ime = false;
	}
	if (cpu_enabling_ime){
		cpu_interrupt_master_enabled = true;
	}
	return true;
}
