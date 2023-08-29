const d_ctx = display.getContext("2d");
const D_WIDTH = 160;
const D_HEIGHT = 144;
const D_DATA = d_ctx.getImageData(0, 0, D_WIDTH, D_HEIGHT);
const D_BUFFER = D_DATA.data;
const D_BUFFER32 = new Uint32Array(D_DATA.data.buffer);

const s_ctx = showcase.getContext("2d");
const S_WIDTH = 256;
const S_HEIGHT = 256;
const S_DATA = s_ctx.getImageData(0, 0, S_WIDTH, S_HEIGHT);
const S_BUFFER = S_DATA.data;
const S_BUFFER32 = new Uint32Array(S_DATA.data.buffer);


function dpRefresh() {
	d_ctx.putImageData(D_DATA, 0, 0);
}

function scRefresh() {
	s_ctx.putImageData(S_DATA, 0, 0);
}


/*
	Internal Functions
*/

function _scDisplayTile(addr, tile, x, y) {
	for (let tile_y=0; tile_y<16; tile_y += 2){
		let b1 = busRead(addr + (tile*16) + tile_y);
		let b2 = busRead(addr + (tile*16) + tile_y + 1);
		
		for (let bit=7; bit>=0; bit--){
			let hi = !!(b1 & (1 << bit)) << 1;
			let lo = !!(b2 & (1 << bit));
			
			let pal_index = hi | lo;
			
			let d_x = x + (7 - bit);
			let d_y = y + (tile_y >> 1);
			
			S_BUFFER32[d_y*S_WIDTH + d_x] = default_palette[pal_index];
		}
	}
}

function _scDisplaySprite(addr, sprite, x, y) {
	for (let tile_y=0; tile_y<16; tile_y += 2){
		let tile = busRead(0xFE00 + (sprite*4) + 2);
		
		let b1 = busRead(addr + (tile*16) + tile_y);
		let b2 = busRead(addr + (tile*16) + tile_y + 1);
		
		for (let bit=7; bit>=0; bit--){
			let hi = !!(b1 & (1 << bit)) << 1;
			let lo = !!(b2 & (1 << bit));
			
			let pal_index = hi | lo;
			
			let d_x = x + (7 - bit);
			let d_y = y + (tile_y >> 1);
			
			S_BUFFER32[d_y*S_WIDTH + d_x] = default_palette[pal_index];
		}
	}
}


/*
	Miscellaneous Functions
*/

function refreshUi() {
	/*
	let x_draw = 0;
	let y_draw = 0;
	let tile_num = 0;
	
	let addr = 0x8000;
	for (let y=0; y<24; y++){
		for (let x=0; x<16; x++){
			_scDisplaySprite(addr, tile_num, x_draw + x, y_draw + y);
			x_draw += 8;
			tile_num++;
		}
		
		y_draw += 8;
		x_draw = 0;
	}
	*/
	s_ctx.clearRect(0, 0, 512, 512);
	
	dpRefresh();
	scRefresh();
	
	s_ctx.fillStyle = "white";
	s_ctx.font = "15px monospace";
	
	s_ctx.fillText("LCDC 0x"+(lcd_lcdc).toString(16).toUpperCase(), 0, 15);
	s_ctx.fillText("LCDS 0x"+(lcd_lcds).toString(16).toUpperCase(), 128, 15);
	s_ctx.fillText("SCY 0x"+(lcd_scroll_y).toString(16).toUpperCase(), 0, 30);
	s_ctx.fillText("SCX 0x"+(lcd_scroll_x).toString(16).toUpperCase(), 128, 30);
	s_ctx.fillText("LY 0x"+(lcd_ly).toString(16).toUpperCase(), 0, 45);
	s_ctx.fillText("LYC 0x"+(lcd_ly_compare).toString(16).toUpperCase(), 128, 45);
	s_ctx.fillText("DMA 0x"+(lcd_dma).toString(16).toUpperCase(), 0, 60);
	s_ctx.fillText("BGP 0x"+(lcd_bg_palette).toString(16).toUpperCase(), 128, 60);
	s_ctx.fillText("OBP0 0x"+(lcd_obj_palette[0]).toString(16).toUpperCase(), 0, 75);
	s_ctx.fillText("OBP1 0x"+(lcd_obj_palette[1]).toString(16).toUpperCase(), 128, 75);
	s_ctx.fillText("WY 0x"+(lcd_win_y).toString(16).toUpperCase(), 0, 90);
	s_ctx.fillText("WX 0x"+(lcd_win_x).toString(16).toUpperCase(), 128, 90);
	
	s_ctx.fillText("IF 0x"+(cpu_int_flags).toString(16).toUpperCase(), 0, 120);
	s_ctx.fillText("IE 0x"+(cpu_reg_ie).toString(16).toUpperCase(), 128, 120);
	
	s_ctx.fillText("PC 0x"+(cpu_reg_pc).toString(16).toUpperCase(), 128, 150);
	
	s_ctx.fillText("PAD_START "+(pad_start).toString(16).toUpperCase(), 0, 180);
	s_ctx.fillText("PAD_SELECT "+(pad_select).toString(16).toUpperCase(), 128, 180);
	s_ctx.fillText("PAD_A "+(pad_a).toString(16).toUpperCase(), 0, 195);
	s_ctx.fillText("PAD_B "+(pad_b).toString(16).toUpperCase(), 128, 195);
	s_ctx.fillText("PAD_UP "+(pad_up).toString(16).toUpperCase(), 0, 210);
	s_ctx.fillText("PAD_DOWN "+(pad_down).toString(16).toUpperCase(), 128, 210);
	s_ctx.fillText("PAD_LEFT "+(pad_left).toString(16).toUpperCase(), 0, 225);
	s_ctx.fillText("PAD_RIGHT "+(pad_right).toString(16).toUpperCase(), 128, 225);
	
}
