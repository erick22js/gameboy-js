
const INTR_VBLANK = 0x01;
const INTR_LCD_STAT = 0x02;
const INTR_TIMER = 0x04;
const INTR_SERIAL = 0x08;
const INTR_JOYPAD = 0x10;


function cpuRequestInterrupt(intr) {
	cpu_int_flags |= intr;
	/*
	switch (intr){
		case INTR_VBLANK: {
			LOG("Interruption VBLANK Requested!");
		}
		break;
		case INTR_LCD_STAT: {
			LOG("Interruption LCD STAT Requested!");
		}
		break;
		case INTR_TIMER: {
			LOG("Interruption TIMER Requested!");
		}
		break;
		case INTR_SERIAL: {
			LOG("Interruption SERIAL Requested!");
		}
		break;
		case INTR_JOYPAD: {
			LOG("Interruption JOYPAD Requested!");
		}
		break;
	}
	*/
}

function cpuHandleInterrupt(adr) {
	stackPush16(cpu_reg_pc);
	cpu_reg_pc = adr;
}

function cpuCheckInterrupt(intr, adr) {
	if ((cpu_int_flags & intr) && (cpu_reg_ie & intr)){
		cpuHandleInterrupt(adr);
		cpu_int_flags &= ~intr;
		cpu_halted = false;
		cpu_interrupt_master_enabled = false;
		return true;
	}
	return false;
}

function cpuHandleInterrupts() {
	if (cpuCheckInterrupt(INTR_VBLANK, 0x40)){
		
	}
	else if (cpuCheckInterrupt(INTR_LCD_STAT, 0x48)){
		
	}
	else if (cpuCheckInterrupt(INTR_TIMER, 0x50)){
		
	}
	else if (cpuCheckInterrupt(INTR_SERIAL, 0x58)){
		
	}
	else if (cpuCheckInterrupt(INTR_JOYPAD, 0x60)){
		
	}
}
