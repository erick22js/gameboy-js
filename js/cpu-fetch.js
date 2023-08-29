
function cpuFetchData() {
	cpu_memory_dest = 0;
	cpu_dest_is_memory = false;
	
	if (cpu_instruction == null){
		return;
	}
	
	switch(cpu_instruction.adrm) {
		case ADM_IMP: return;
		
		case ADM_R: {
			cpu_fetched_data = cpuReadReg(cpu_instruction.reg1);
			return;
		}
		
		case ADM_R_R: {
			cpu_fetched_data = cpuReadReg(cpu_instruction.reg2);
			return;
		}
		
		case ADM_R_D8: {
			cpu_fetched_data = busRead(cpu_reg_pc);
			emuCycles(1);
			cpu_reg_pc++;
			return;
		}
		
		case ADM_R_D16:
		case ADM_D16: {
			let lo = busRead(cpu_reg_pc);
			emuCycles(1);
			let hi = busRead(cpu_reg_pc + 1);
			emuCycles(1);
			cpu_fetched_data = lo | (hi << 8);
			cpu_reg_pc += 2;
			return;
		}
		
		case ADM_MR_R: {
			cpu_fetched_data = cpuReadReg(cpu_instruction.reg2);
			cpu_memory_dest = cpuReadReg(cpu_instruction.reg1);
			cpu_dest_is_memory = true;
			if (cpu_instruction.reg1==RT_C){
				cpu_memory_dest |= 0xFF00;
			}
			return;
		}
		
		case ADM_R_MR: {
			let addr = cpuReadReg(cpu_instruction.reg2);
			if (cpu_instruction.reg2==RT_C){
				addr |= 0xFF00;
			}
			cpu_fetched_data = busRead(addr);
			emuCycles(1);
			return;
		}
		
		case ADM_R_HLI: {
			cpu_fetched_data = busRead(cpuReadReg(cpu_instruction.reg2));
			emuCycles(1);
			cpuWriteReg(RT_HL, cpuReadReg(RT_HL) + 1);
			return;
		}
		
		case ADM_R_HLD: {
			cpu_fetched_data = busRead(cpuReadReg(cpu_instruction.reg2));
			emuCycles(1);
			cpuWriteReg(RT_HL, cpuReadReg(RT_HL) - 1);
			return;
		}
		
		case ADM_HLI_R: {
			cpu_fetched_data = cpuReadReg(cpu_instruction.reg2);
			cpu_memory_dest = cpuReadReg(cpu_instruction.reg1);
			cpu_dest_is_memory = true;
			cpuWriteReg(RT_HL, cpuReadReg(RT_HL) + 1);
		}
		break;
		
		case ADM_HLD_R: {
			cpu_fetched_data = cpuReadReg(cpu_instruction.reg2);
			cpu_memory_dest = cpuReadReg(cpu_instruction.reg1);
			cpu_dest_is_memory = true;
			cpuWriteReg(RT_HL, cpuReadReg(RT_HL) - 1);
		}
		break;
		
		case ADM_R_A8: {
			cpu_fetched_data = busRead(cpu_reg_pc);
			emuCycles(1);
			cpu_reg_pc++;
			return;
		}
		
		case ADM_A8_R: {
			cpu_memory_dest = busRead(cpu_reg_pc) | 0xFF00;
			cpu_dest_is_memory = true;
			emuCycles(1);
			cpu_reg_pc++;
			return;
		}
		
		case ADM_HL_SPR: {
			cpu_fetched_data = busRead(cpu_reg_pc);
			emuCycles(1);
			cpu_reg_pc++;
			return;
		}
		
		case ADM_D8: {
			cpu_fetched_data = busRead(cpu_reg_pc);
			emuCycles(1);
			cpu_reg_pc++;
			return;
		}
		
		case ADM_A16_R:
		case ADM_D16_R: {
			let lo = busRead(cpu_reg_pc);
			emuCycles(1);
			let hi = busRead(cpu_reg_pc + 1);
			emuCycles(1);
			cpu_memory_dest = lo | (hi << 8);
			cpu_dest_is_memory = true;
			cpu_reg_pc += 2;
			cpu_fetched_data = cpuReadReg(cpu_instruction.reg2);
			return;
		}
		
		case ADM_MR_D8: {
			cpu_fetched_data = busRead(cpu_reg_pc);
			emuCycles(1);
			cpu_reg_pc++;
			cpu_memory_dest = cpuReadReg(cpu_instruction.reg1);
			cpu_dest_is_memory = true;
			return;
		}
		
		case ADM_MR: {
			cpu_memory_dest = cpuReadReg(cpu_instruction.reg1);
			cpu_dest_is_memory = true;
			cpu_fetched_data = busRead(cpuReadReg(cpu_instruction.reg1));
			return;
		}
		
		case ADM_R_A16: {
			let lo = busRead(cpu_reg_pc);
			emuCycles(1);
			let hi = busRead(cpu_reg_pc + 1);
			emuCycles(1);
			let addr = lo | (hi << 8);
			cpu_reg_pc += 2;
			cpu_fetched_data = busRead(addr);
			emuCycles(1);
			return;
		}
		
		default: {
			notImplemented("Unknown Addressing Mode " + cpu_instruction.adrm);
		}
	}
}
