
/*
	Properties
*/

let lcd_lcdc = 0x0;
let lcd_lcds = 0x0;
let lcd_scroll_y = 0x0;
let lcd_scroll_x = 0x0;
let lcd_ly = 0x0;
let lcd_ly_compare = 0x0;
let lcd_dma = 0x0;
let lcd_bg_palette = 0x0;
let lcd_obj_palette = new Uint8Array(2);
let lcd_win_y = 0x0;
let lcd_win_x = 0x0;

let default_palette = new Uint32Array([0xFFFFFFFF, 0xFFAAAAAA, 0xFF555555, 0xFF000000]);

let palette_bg = new Uint32Array(4);
let palette_sp1 = new Uint32Array(4);
let palette_sp2 = new Uint32Array(4);


const LCD_MODE_HBLANK = 0x0;
const LCD_MODE_VBLANK = 0x1;
const LCD_MODE_OAM = 0x2;
const LCD_MODE_XFER = 0x3;


/*
	Util Functions
*/

function getLcdcBgwEnable() {
	return bitGet(lcd_lcdc, 0);
}

function getLcdcObjEnable() {
	return bitGet(lcd_lcdc, 1);
}

function getLcdcObjHeight() {
	return bitGet(lcd_lcdc, 2)? 16: 8;
}

function getLcdcBgMapArea() {
	return bitGet(lcd_lcdc, 3)? 0x9C00: 0x9800;
}

function getLcdcBgwDataArea() {
	return bitGet(lcd_lcdc, 4)? 0x8000: 0x8800;
}

function getLcdcWinEnable() {
	return bitGet(lcd_lcdc, 5);
}

function getLcdcWinMapArea() {
	return bitGet(lcd_lcdc, 6)? 0x9C00: 0x9800;
}

function getLcdcLcdEnable() {
	return bitGet(lcd_lcdc, 7);
}


function getLcdsMode() {
	return lcd_lcds & 0b11;
}

function setLcdsMode(mode) {
	lcd_lcds = (lcd_lcds&(~0b11)) | (mode&0b11);
}

function getLcdsLyc() {
	return bitGet(lcd_lcds, 2);
}

function setLcdsLyc(b) {
	lcd_lcds = bitSet(lcd_lcds, 2, b);
}


const LCDS_INT_HBLANK = 3;
const LCDS_INT_VBLANK = 4;
const LCDS_INT_OAM = 5;
const LCDS_INT_LYC = 6;

function getLcdsStatInt(intr) {
	return bitGet(lcd_lcds, intr);
}

function setLcdsStatInt(intr, b) {
	lcd_lcds = bitSet(lcd_lcds, intr, b);
}


/*
	Working Functions
*/

function lcdUpdatePalette(data, pal) {
	data &= 0b11111100;
	let colors = palette_bg;
	
	switch (pal){
		case 1:{
			colors = palette_sp1;
		}
		break;
		case 2:{
			colors = palette_sp2;
		}
		break;
	}
	
	colors[0] = default_palette[data & 0b11];
	colors[1] = default_palette[(data >> 2) & 0b11];
	colors[2] = default_palette[(data >> 4) & 0b11];
	colors[3] = default_palette[(data >> 6) & 0b11];
}

function lcdInit() {
	lcd_lcdc = 0x91;
	lcd_scroll_x = 0;
	lcd_scroll_y = 0;
	lcd_ly = 0;
	lcd_ly_compare = 0;
	lcd_bg_palette = 0xFC;
	lcd_obj_palette[0] = 0xFF;
	lcd_obj_palette[1] = 0xFF;
	lcd_win_x = 0;
	lcd_win_y = 0;
	
	for (let i=0; i<4; i++){
		palette_bg[i] = default_palette[i];
		palette_sp1[i] = default_palette[i];
		palette_sp2[i] = default_palette[i];
	}
}

function lcdTick() {
	
}

