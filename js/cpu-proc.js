
let processors = [
	// Proc None
	function() {
		notImplemented("INVALID INSTRUCTION!");
	},
	
	// Proc Nop
	function() {},
	
	// Proc Ld
	function() {
		if (cpu_dest_is_memory){
			if (procIsReg16Bit(cpu_instruction.reg2)){
				emuCycles(1);
				busWrite16(cpu_memory_dest, cpu_fetched_data);
			}
			else{
				busWrite(cpu_memory_dest, cpu_fetched_data);
			}
			emuCycles(1);
			return;
		}
		if (cpu_instruction.adrm == ADM_HL_SPR){
			cpu_fetched_data = u8ToInt(cpu_fetched_data);
			let hflag = ((cpuReadReg(cpu_instruction.reg2)&0x0F) + (cpu_fetched_data&0x0F)) >= 0x10;
			let cflag = ((cpuReadReg(cpu_instruction.reg2)&0xFF) + (cpu_fetched_data&0xFF)) >= 0x100;
			procSetCpuFlags(0, 0, hflag, cflag);
			cpuWriteReg(cpu_instruction.reg1, cpuReadReg(cpu_instruction.reg2) + cpu_fetched_data);
			return;
		}
		cpuWriteReg(cpu_instruction.reg1, cpu_fetched_data);
	},
	
	// Proc Inc
	function() {
		let val = cpuReadReg(cpu_instruction.reg1) + 1;
		if (procIsReg16Bit(cpu_instruction.reg1)){
			emuCycles(1);
		}
		if (cpu_instruction.reg1 == RT_HL && cpu_instruction.adrm == ADM_MR){
			val = busRead(cpuReadReg(RT_HL)) + 1;
			val &= 0xFF;
			busWrite(cpuReadReg(RT_HL), val);
		}
		else{
			cpuWriteReg(cpu_instruction.reg1, val);
			val = cpuReadReg(cpu_instruction.reg1);
		}
		if ((cpu_current_opcode & 0x03) == 0x03){
			return;
		}
		procSetCpuFlags(val == 0, 0, (val&0x0F) == 0, -1);
	},
	
	// Proc Dec
	function() {
		let val = cpuReadReg(cpu_instruction.reg1) - 1;
		if (procIsReg16Bit(cpu_instruction.reg1)){
			emuCycles(1);
		}
		if (cpu_instruction.reg1 == RT_HL && cpu_instruction.adrm == ADM_MR){
			val = busRead(cpuReadReg(RT_HL)) - 1;
			//val &= 0xFF;
			busWrite(cpuReadReg(RT_HL), val);
		}
		else{
			cpuWriteReg(cpu_instruction.reg1, val);
			val = cpuReadReg(cpu_instruction.reg1);
		}
		if ((cpu_current_opcode & 0x0B) == 0x0B){
			return;
		}
		procSetCpuFlags(val == 0, 1, (val&0x0F) == 0x0F, -1);
	},
	
	// Proc Rlca
	function() {
		let res = cpuReadReg(RT_A);
		let flag_c = (res >> 7) & 1;
		res = (res << 1) | flag_c;
		cpuWriteReg(RT_A, res);
		procSetCpuFlags(0, 0, 0, flag_c);
	},
	
	// Proc Add
	function() {
		let val = cpuReadReg(cpu_instruction.reg1) + cpu_fetched_data;
		let is16bit = procIsReg16Bit(cpu_instruction.reg1);
		if (is16bit){
			emuCycles(1);
		}
		if (cpu_instruction.reg1 == RT_SP){
			val = cpuReadReg(cpu_instruction.reg1) + u8ToInt(cpu_fetched_data);
		}
		let z = (val & 0xFF) == 0;
		let h = (cpuReadReg(cpu_instruction.reg1) & 0xF) + (cpu_fetched_data & 0xF) >= 0x10;
		let c = (cpuReadReg(cpu_instruction.reg1) & 0xFF) + (cpu_fetched_data & 0xFF) >= 0x100;
		
		if (is16bit){
			z = -1;
			h = (cpuReadReg(cpu_instruction.reg1) & 0xFFF) + (cpu_fetched_data & 0xFFF) >= 0x1000;
			let n = (cpuReadReg(cpu_instruction.reg1)) + (cpu_fetched_data);
			c = n >= 0x10000;
		}
		
		if (cpu_instruction.reg1 == RT_SP){
			z = 0;
			h = (cpuReadReg(cpu_instruction.reg1) & 0xF) + (cpu_fetched_data & 0xF) >= 0x10;
			c = (cpuReadReg(cpu_instruction.reg1) & 0xFF) + (cpu_fetched_data & 0xFF) >= 0x100;
		}
		
		cpuWriteReg(cpu_instruction.reg1, val & 0xFFFF);
		procSetCpuFlags(z, 0, h, c);
	},
	
	// Proc Rrca
	function() {
		let val_a = cpuReadReg(RT_A);
		let flag_c = val_a & 1;
		val_a >>>= 1;
		val_a |= flag_c << 7;
		cpuWriteReg(RT_A, val_a);
		procSetCpuFlags(0, 0, 0, flag_c);
	},
	
	// Proc Stop
	function() {
		//notImplemented("CPU Stop Request");
	},
	
	// Proc Rla
	function() {
		let val_a = cpuReadReg(RT_A);
		let flag_c = bitGet(cpuReadReg(RT_F), CPU_FLAG_C);
		let new_c = (val_a >> 7) & 1;
		cpuWriteReg(RT_A, (val_a << 1) | flag_c);
		procSetCpuFlags(0, 0, 0, new_c);
	},
	
	// Proc Jr
	function() {
		let rel = u8ToInt(cpu_fetched_data);
		let addr = cpu_reg_pc + rel;
		procJmpToAddr(addr, false);
	},
	
	// Proc Rra
	function() {
		let val_a = cpuReadReg(RT_A);
		let flag_c = bitGet(cpuReadReg(RT_F), CPU_FLAG_C);
		let new_c = val_a & 1;
		
		val_a >>>= 1;
		val_a |= (flag_c << 7);
		cpuWriteReg(RT_A, val_a);
		procSetCpuFlags(0, 0, 0, new_c);
	},
	
	// Proc Daa
	function() {
		let res = 0;
		let val_a = cpuReadReg(RT_A);
		let flag_h = bitGet(cpuReadReg(RT_F), CPU_FLAG_H);
		let flag_c = bitGet(cpuReadReg(RT_F), CPU_FLAG_C);
		let flag_n = bitGet(cpuReadReg(RT_F), CPU_FLAG_N);
		
		if (flag_h || ((!flag_n) && ((val_a & 0xF) > 0x9))){
			res += 0x6;
		}
		if (flag_c || ((!flag_n) && (val_a > 0x99))){
			res += 0x60;
			flag_c = 1;
		}
		else{
			flag_c = 0;
		}
		
		val_a += flag_n? -res: res;
		cpuWriteReg(RT_A, val_a);
		
		procSetCpuFlags(((val_a)&0xFF) == 0, -1, 0, flag_c);
	},
	
	// Proc Cpl
	function() {
		cpuWriteReg(RT_A, ~cpuReadReg(RT_A));
		procSetCpuFlags(-1, 1, 1, -1);
	},
	
	// Proc Scf
	function() {
		procSetCpuFlags(-1, 0, 0, 1);
	},
	
	// Proc Ccf
	function() {
		procSetCpuFlags(-1, 0, 0, bitGet(cpuReadReg(RT_F), CPU_FLAG_C) ^ 1);
	},
	
	// Proc Halt
	function() {
		cpu_halted = true;
	},
	
	// Proc Adc
	function() {
		let u = cpu_fetched_data;
		let a = cpuReadReg(RT_A);
		let c = bitGet(cpuReadReg(RT_F), CPU_FLAG_C);
		let res = (a + u + c) & 0xFF;
		cpuWriteReg(RT_A, res);
		procSetCpuFlags(
			res == 0, 0,
			((a & 0xF) + (u & 0xF) + c) > 0xF,
			(a + u + c) > 0xFF
		);
	},
	
	// Proc Sub
	function() {
		let val = cpuReadReg(cpu_instruction.reg1) - cpu_fetched_data;
		
		let z = val == 0;
		let h = ((cpuReadReg(cpu_instruction.reg1) & 0xF) - (cpu_fetched_data & 0xF)) < 0;
		let c = ((cpuReadReg(cpu_instruction.reg1)) - (cpu_fetched_data)) < 0;
		
		cpuWriteReg(cpu_instruction.reg1, val);
		procSetCpuFlags(z, 1, h, c);
	},
	
	// Proc Sbc
	function() {
		let c = bitGet(cpuReadReg(RT_F), CPU_FLAG_C);
		let val = cpu_fetched_data + c;
		let reg_val = cpuReadReg(cpu_instruction.reg1);
		
		let z = (((reg_val) - val)&0xFF) == 0;
		let h = ((reg_val&0xF) - (cpu_fetched_data&0xF) - c) < 0x0;
		let new_c = (reg_val - cpu_fetched_data - c) < 0x0;
		
		cpuWriteReg(cpu_instruction.reg1, reg_val - val);
		procSetCpuFlags(z, 1, h, new_c);
	},
	
	// Proc And
	function() {
		let reg_a = cpuReadReg(RT_A);
		reg_a &= cpu_fetched_data;
		cpuWriteReg(RT_A, reg_a&0xFF);
		procSetCpuFlags(reg_a==0, 0, 1, 0);
	},
	
	// Proc Xor
	function() {
		let reg_a = cpuReadReg(RT_A);
		reg_a ^= cpu_fetched_data;
		cpuWriteReg(RT_A, reg_a&0xFF);
		procSetCpuFlags(reg_a==0, 0, 0, 0);
	},
	
	// Proc Or
	function() {
		let reg_a = cpuReadReg(RT_A);
		reg_a |= cpu_fetched_data;
		cpuWriteReg(RT_A, reg_a&0xFF);
		procSetCpuFlags(reg_a==0, 0, 0, 0);
	},
	
	// Proc Cp
	function() {
		let reg_a = cpuReadReg(RT_A);
		let res = reg_a - cpu_fetched_data;
		procSetCpuFlags(res==0, 1,
			(reg_a&0x0F) - (cpu_fetched_data&0x0F) < 0, res < 0);
	},
	
	// Proc Pop
	function() {
		let lo = stackPop();
		emuCycles(1);
		let hi = stackPop();
		emuCycles(1);
		let data = lo | (hi << 8);
		cpuWriteReg(cpu_instruction.reg1, data);
		if (cpu_instruction.reg1 == RT_AF){
			cpuWriteReg(cpu_instruction.reg1, data & 0xFFF0);
		}
	},
	
	// Proc Jp
	function() {
		procJmpToAddr(cpu_fetched_data, false);
	},
	
	// Proc Push
	function() {
		let hi = (cpuReadReg(cpu_instruction.reg1) >> 8) & 0xFF;
		emuCycles(1);
		stackPush(hi);
		
		let lo = cpuReadReg(cpu_instruction.reg1) & 0xFF;
		emuCycles(1);
		stackPush(lo);
		
		emuCycles(1);
	},
	
	// Proc Ret
	function() {
		procReturn();
	},
	
	// Proc Cb
	function() {
		let op = cpu_fetched_data;
		let reg = EX_RT_LOOKUP[op & 0b111];
		let bit = (op >> 3) & 0b111;
		let opr = (op >> 6) & 0b11;
		
		let reg_val = cpuCBReadReg(reg);
		
		emuCycles(1);
		
		if (reg == RT_HL){
			emuCycles(2);
		}
		
		switch (opr){
			case 1:{ // BIT
				procSetCpuFlags(!(reg_val & (1 << bit)), 0, 1, -1);
				return;
			}
			case 2:{ // RST
				reg_val &= ~(1 << bit);
				cpuCBWriteReg(reg, reg_val);
				return;
			}
			case 3:{ // SET
				reg_val |= (1 << bit);
				cpuCBWriteReg(reg, reg_val);
				return;
			}
		}
		
		let flag_c = bitGet(cpuReadReg(RT_F), CPU_FLAG_C);
		
		switch(bit) {
			case 0: { // RLC
				let set_c = false;
				let res = (reg_val << 1) & 0xFF;
				if ((reg_val & (1 << 7)) != 0){
					res |= 1;
					set_c = true;
				}
				res &= 0xFF;
				cpuCBWriteReg(reg, res);
				procSetCpuFlags(res == 0, false, false, set_c);
				return;
			}
			case 1: { // RRC
				let old = reg_val;
				reg_val >>= 1;
				reg_val |= (old << 7);
				reg_val &= 0xFF;
				cpuCBWriteReg(reg, reg_val);
				procSetCpuFlags(!reg_val, false, false, old & 1);
				return;
			}
			case 2: { // RL
				let old = reg_val;
				reg_val <<= 1;
				reg_val |= flag_c;
				reg_val &= 0xFF;
				cpuCBWriteReg(reg, reg_val);
				procSetCpuFlags(!reg_val, false, false, !!(old&0x80));
				return;
			}
			case 3: { // RR
				let old = reg_val;
				reg_val >>= 1;
				reg_val |= (flag_c << 7);
				reg_val &= 0xFF;
				cpuCBWriteReg(reg, reg_val);
				procSetCpuFlags(!reg_val, false, false, old & 1);
				return;
			}
			case 4: { // SLA
				let old = reg_val;
				reg_val <<= 1;
				reg_val &= 0xFF;
				cpuCBWriteReg(reg, reg_val);
				procSetCpuFlags(!reg_val, false, false, !!(old&0x80));
				return;
			}
			case 5: { // SRA
				let u = u8ToInt(reg_val) >> 1;
				u &= 0xFF;
				cpuCBWriteReg(reg, u);
				procSetCpuFlags(!u, false, false, reg_val & 1);
				return;
			}
			case 6: { // SWAP
				reg_val = ((reg_val & 0x0F) << 4) | ((reg_val & 0xF0) >> 4);
				reg_val &= 0xFF;
				cpuCBWriteReg(reg, reg_val);
				procSetCpuFlags(reg_val==0, false, false, false);
				return;
			}
			case 7: { // SRL
				let u = reg_val >> 1;
				u &= 0xFF;
				cpuCBWriteReg(reg, u);
				procSetCpuFlags(!u, 0, 0, reg_val&1);
				return;
			}
		}
		notImplemented("Invalid CB "+op);
	},
	
	// Proc Call
	function() {
		procJmpToAddr(cpu_fetched_data, true);
	},
	
	// Proc Reti
	function() {
		cpu_interrupt_master_enabled = true;
		procReturn();
	},
	
	// Proc Ldh
	function() {
		if (cpu_instruction.reg1 == RT_A){
			cpuWriteReg(cpu_instruction.reg1, busRead(0xFF00 | cpu_fetched_data));
		}
		else{
			busWrite(cpu_memory_dest, cpuReadReg(RT_A));
		}
		emuCycles(1);
	},
	
	// Proc Jphl
	null,
	
	// Proc Di
	function() {
		cpu_interrupt_master_enabled = false;
	},
	
	// Proc Ei
	function() {
		cpu_enabling_ime = true;
	},
	
	// Proc Rst
	function() {
		procJmpToAddr(cpu_instruction.param, true);
	},
	
	// Proc Err
	null,
	
	// Proc Rlc
	null,
	
	// Proc Rrc
	null,
	
	// Proc Rl
	null,
	
	// Proc Rr
	null,
	
	// Proc Sla
	null,
	
	// Proc Sra
	null,
	
	// Proc Swap
	null,
	
	// Proc Srl
	null,
	
	// Proc Bit
	null,
	
	// Proc Res
	null,
	
	// Proc Set
	null
];

//
//	Extra Internal Processor Function
//

function procCheckCondition() {
	let z = bitGet(cpuReadReg(RT_F), CPU_FLAG_Z);
	let c = bitGet(cpuReadReg(RT_F), CPU_FLAG_C);
	
	switch (cpu_instruction.ct){
		case CT_C: return c;
		case CT_NC: return !c;
		case CT_Z: return z;
		case CT_NZ: return !z;
	}
	return true;
}

function procIsReg16Bit(reg){
	return reg >= RT_AF;
}

function procSetCpuFlags(z=-1, n=-1, h=-1, c=-1) {
	let reg_f = cpuReadReg(RT_F);
	if (z!=-1){
		reg_f = bitSet(reg_f, CPU_FLAG_Z, z);
	}
	if (n!=-1){
		reg_f = bitSet(reg_f, CPU_FLAG_N, n);
	}
	if (h!=-1){
		reg_f = bitSet(reg_f, CPU_FLAG_H, h);
	}
	if (c!=-1){
		reg_f = bitSet(reg_f, CPU_FLAG_C, c);
	}
	cpuWriteReg(RT_F, reg_f);
}

function procJmpToAddr(addr, pushpc) {
	if (procCheckCondition()){
		if (pushpc){
			emuCycles(2);
			stackPush16(cpu_reg_pc);
		}
		
		cpu_reg_pc = addr;
		emuCycles(1);
	}
}

function procReturn() {
	if (cpu_instruction.ct != CT_NONE){
		emuCycles(1);
	}
	
	if (procCheckCondition()){
		let lo = stackPop();
		emuCycles(1);
		let hi = stackPop();
		emuCycles(1);
		
		let adr = lo | (hi << 8);
		cpu_reg_pc = adr;
		
		emuCycles(1);
	}
}


