
//
//	Memory Map
//
// 0x0000..0x3FFF => 16KiB Rom Bank 00
// 0x4000..0x7FFF => 16KiB Rom Bank 01~NN
// 0x8000..0x9FFF => 8KiB Video RAM
// 0xA000..0xBFFF => 8KiB External RAM
// 0xC000..0xCFFF => 4KiB Work RAM (WRAM)
// 0xD000..0xDFFF => 4KiB Work RAM (WRAM), switchable bank 1~7 in GBC
// 0xE000..0xFDFF => Mirror of 0xC000..0xDDFF (Prohibited by Nintendo)
// 0xFE00..0xFE9F => Object Attribute Memory (OAM)
// 0xFEA0..0xFEFF => (Prohibited by Nintendo)
// 0xFF00..0xFF7F => I/O Registers
// 0xFF80..0xFFFE => High RAM (HRAM)
// 0xFFFF => Interrupt Enable Register (IE)

function busRead(adr) {
	if (adr < 0x8000){
		return cartRead(adr);
	}
	if (adr < 0xA000){
		return ppuVramRead(adr-0x8000);
	}
	if (adr < 0xC000){
		return cartRead(adr);
	}
	if (adr < 0xE000){
		return wramRead(adr-0xC000);
	}
	if (adr < 0xFE00){
		return 0;
	}
	if (adr < 0xFEA0){
		if (dmaTransferring()){
			return 0xFF;
		}
		return ppuOamRead(adr-0xFE00);
	}
	if (adr < 0xFF00){
		return 0;
	}
	if (adr < 0xFF80){
		return ioRead(adr-0xFF00);
	}
	if (adr == 0xFFFF){
		return cpu_reg_ie;
	}
	
	return hramRead(adr-0xFF80);
}

function busRead16(adr) {
	return busRead(adr) | (busRead(adr+1)<<8);
}

function busWrite(adr, data) {
	if (adr < 0x8000){
		cartWrite(adr, data);
		return;
	}
	if (adr < 0xA000){
		ppuVramWrite(adr-0x8000, data);
		return;
	}
	if (adr < 0xC000){
		cartWrite(adr, data);
		return;
	}
	if (adr < 0xE000){
		wramWrite(adr-0xC000, data);
		return;
	}
	if (adr < 0xFE00){
		return;
	}
	if (adr < 0xFEA0){
		if (dmaTransferring()){
			return;
		}
		ppuOamWrite(adr-0xFE00, data);
		return;
	}
	if (adr < 0xFF00){
		return;
	}
	if (adr < 0xFF80){
		ioWrite(adr-0xFF00, data);
	}
	if (adr == 0xFFFF){
		cpu_reg_ie = data;
		return;
	}
	
	hramWrite(adr-0xFF80, data);
}

function busWrite16(adr, data) {
	busWrite(adr, data&0xFF);
	busWrite(adr+1, (data>>8)&0xFF);
}
