
//
//	IO Registers
//

let io_serial_data = new Uint8Array(2);


//
//	IO Access Methods
//

function ioRead(adr) {
	switch (adr){
		case 0x00: {
			return gamepadGetOutput();
		}
		
		// Serial Access
		case 0x01: {
			return io_serial_data[0];
		}
		case 0x02: {
			return io_serial_data[1];
		}
		
		// Timer
		case 0x04: {
			return timer_div >> 8;
		}
		case 0x05: {
			return timer_tima;
		}
		case 0x06: {
			return timer_tma;
		}
		case 0x07: {
			return timer_tac;
		}
		
		case 0x0F: {
			return cpu_int_flags;
		}
		
		// LCD/PPU
		case 0x40: {
			return lcd_lcdc;
		}
		case 0x41: {
			return lcd_lcds;
		}
		case 0x42: {
			return lcd_scroll_y;
		}
		case 0x43: {
			return lcd_scroll_x;
		}
		case 0x44: {
			return lcd_ly;
		}
		case 0x45: {
			return lcd_ly_compare;
		}
		case 0x46: { // DMA
			return lcd_dma;
		}
		case 0x47: {
			return lcd_bg_palette;
		}
		case 0x48: {
			return lcd_obj_palette[0];
		}
		case 0x49: {
			return lcd_obj_palette[1];
		}
		case 0x4A: {
			return lcd_win_y;
		}
		case 0x4B: {
			return lcd_win_x;
		}
	}
	//LOG("Not Implemented IO Read at "+(adr+0xFF00));
	return 0x0;
}

function ioWrite(adr, data) {
	switch (adr){
		case 0x00: {
			gamepadSetSel(data);
			return;
		}
		
		// Serial Access
		case 0x01: {
			io_serial_data[0] = data;
			return;
		}
		case 0x02: {
			io_serial_data[1] = data;
			return;
		}
		
		// Timer
		case 0x04: {
			timer_div = 0;
			return;
		}
		case 0x05: {
			timer_tima = data;
			return;
		}
		case 0x06: {
			timer_tma = data;
			return;
		}
		case 0x07: {
			timer_tac = data;
			return;
		}
		
		case 0x0F: {
			cpu_int_flags = data;
			return;
		}
		
		// LCD/PPU
		case 0x40: {
			lcd_lcdc = data;
			return;
		}
		case 0x41: {
			lcd_lcds = data;
			return;
		}
		case 0x42: {
			lcd_scroll_y = data;
			return;
		}
		case 0x43: {
			lcd_scroll_x = data;
			return;
		}
		case 0x44: { // Read-Only
			//lcd_ly = data;
			return;
		}
		case 0x45: {
			lcd_ly_compare = data;
			return;
		}
		case 0x46: { // DMA
			lcd_dma = data;
			dmaStart(data);
			return
		}
		case 0x47: {
			lcd_bg_palette = data;
			lcdUpdatePalette(data, 0);
			return;
		}
		case 0x48: {
			lcd_obj_palette[0] = data;
			lcdUpdatePalette(data, 1);
			return;
		}
		case 0x49: {
			lcd_obj_palette[1] = data;
			lcdUpdatePalette(data, 2);
			return;
		}
		case 0x4A: {
			lcd_win_y = data;
			return;
		}
		case 0x4B: {
			lcd_win_x = data;
			return;
		}
	}
	//LOG("Not Implemented IO Write at "+(adr+0xFF00));
}

