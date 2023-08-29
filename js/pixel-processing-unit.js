
/*
	OAM Entry
	
	Bit7   BG and Window over OBJ (0=No, 1=BG and Window colors 1-3 over the OBJ)
	Bit6   Y flip          (0=Normal, 1=Vertically mirrored)
	Bit5   X flip          (0=Normal, 1=Horizontally mirrored)
	Bit4   Palette number  **Non CGB Mode Only** (0=OBP0, 1=OBP1)
	Bit3   Tile VRAM-Bank  **CGB Mode Only**     (0=Bank 0, 1=Bank 1)
	Bit2-0 Palette number  **CGB Mode Only**     (OBP0-7)
*/

let ppu_oam_ram = new Uint8Array(40 * 4);
let ppu_vram = new Uint8Array(0x2000);
let ppu_current_frame = 0x0;
let ppu_lines_tick = 0x0;
let ppu_window_line = 0;

let ppu_oam_line_sprite_count = 0; // Up to 10 Sprites
let ppu_oam_line_sprites = new Uint8Array(10); // List of current sprites
let ppu_oam_line_entry = new Uint8Array(10); // List of current sprites on line
let ppu_oam_line_entry_array = new Uint8Array(10); // Memory to use for list

let ppu_oam_fetched_entry_count = 0;
let ppu_oam_fetched_entries = new Uint8Array(3); // Entries fetched during pipeline


/*
	Pixel FIFO Rendering Processes
*/

const PFSTATE_TILE = 0x0;
const PFSTATE_DATA0 = 0x1;
const PFSTATE_DATA1 = 0x2;
const PFSTATE_IDLE = 0x3;
const PFSTATE_PUSH = 0x4;

// Collection of pixel color
const fifo_states = new Uint32Array(256);
let fifo_state_head = 0x0;
let fifo_state_size = 0x0;
let fifo_state_tail = 0x0;

// FIFO State
let fifo_line_x = 0x0;
let fifo_pushed_x = 0x0;
let fifo_fetch_x = 0x0;
let fifo_bgw_fetch_data = new Uint8Array(3);
let fifo_oam_fetch_data = new Uint8Array(6);
let fifo_map_y = 0;
let fifo_map_x = 0;
let fifo_tile_y = 0;
let fifo_fifo_x = 0;

let mark_line = 0;

let fifo_cur_fetch_state = PFSTATE_IDLE;


function pixelFifoPush(value) {
	fifo_states[fifo_state_tail] = value;
	fifo_state_tail = (fifo_state_tail+1) & 0xFF;
	fifo_state_size++;
}

function pixelFifoPop() {
	if (fifo_state_size <= 0){
		notImplemented("Poping FIFO Value from a empty Stack");
	}
	let value = fifo_states[fifo_state_head];
	fifo_state_head = (fifo_state_head+1) & 0xFF;
	fifo_state_size--;
	
	return value;
}

function fetchSpritePixels(bit, bg_color, bg_index) {
	for (let i=0; i<ppu_oam_fetched_entry_count; i++){
		let entry = ppu_oam_fetched_entries[i];
		let sp_x = (ppu_oam_ram[entry+1] - 8) + (lcd_scroll_x % 8);
		let sp_stat = ppu_oam_ram[entry+3];
		if ((sp_x + 8) < fifo_fifo_x){
			// Sprite already passed away
			continue;
		}
		
		let offset = fifo_fifo_x - sp_x;
		if ((offset < 0) || (offset > 7)){
			// Out of bounds
			continue;
		}
		
		bit = (7 - offset);
		if (sp_stat&0x20){ // Check if X-flipped
			bit = offset;
		}
		
		let hi = !!(fifo_oam_fetch_data[i * 2] & (1 << bit));
		let lo = !!(fifo_oam_fetch_data[(i * 2) + 1] & (1 << bit)) << 1;
		
		let bg_priority = sp_stat&0x80;
		if (!(hi|lo)){ // Transparency
			continue;
		}
		if ((!bg_priority) || (bg_index == 0)){
			//bg_color = default_palette[lo|hi];
			bg_color = sp_stat&0x10? palette_sp2[hi|lo]: palette_sp1[hi|lo];
			if (hi|lo){
				break;
			}
		}
	}
	return bg_color;
}

function pipelinePixelAdd() {
	if (fifo_state_size > 8){
		// Fifo is full!
		return false;
	}
	
	let x = fifo_fetch_x - (8 - (lcd_scroll_x % 8));
	
	for (let i=0; i<8; i++){
		let bit = 7 - i;
		let hi = !!(fifo_bgw_fetch_data[1] & (1 << bit));
		let lo = !!(fifo_bgw_fetch_data[2] & (1 << bit)) << 1;
		//let color = default_palette[hi | lo];
		let color = palette_bg[hi | lo];
		
		if (!getLcdcBgwEnable()){
			//color = default_palette[0];
			color = palette_bg[0];
		}
		
		if (getLcdcObjEnable()){
			color = fetchSpritePixels(bit, color, hi | lo);
		}
		
		if (x >= 0){
			pixelFifoPush(color);
			fifo_fifo_x++;
		}
	}
	
	return true;
}

function pipelineLoadSpriteTile() {
	for (let f=0; f<ppu_oam_line_sprite_count; f++){
		let entry = ppu_oam_line_sprites[f];
		let sp_x = (ppu_oam_ram[entry+1] - 8) + (lcd_scroll_x % 8);
		
		if ((sp_x >= fifo_fetch_x && sp_x < (fifo_fetch_x + 8))||
			((sp_x + 8) >= fifo_fetch_x && (sp_x + 8) < (fifo_fetch_x + 8))){
			ppu_oam_fetched_entries[ppu_oam_fetched_entry_count] = entry;
			ppu_oam_fetched_entry_count++;
		}
		
		// Max of 3 sprites for fetch on pixel reached
		if (ppu_oam_fetched_entry_count >= 3){
			break;
		}
	}
}

function pipelineLoadSpriteData(offset) {
	let cur_y = lcd_ly;
	let sprite_height = getLcdcObjHeight();
	
	for (let i=0; i<ppu_oam_fetched_entry_count; i++){
		let entry = ppu_oam_fetched_entries[i];
		let flags = ppu_oam_ram[entry+3];
		let ty = ((cur_y + 16) - ppu_oam_ram[entry]) * 2;
		
		if (flags&0x40){ // If Y-Flipped
			ty = ((sprite_height * 2) - 2) - ty;
		}
		
		let tile_index = ppu_oam_ram[entry+2];
		
		if (sprite_height == 16){
			tile_index &= ~(1); // Clear the last bit for operation
		}
		
		fifo_oam_fetch_data[(i*2) + offset] =
			busRead(0x8000 + (tile_index * 16) + ty + offset);
	}
}

function pipelineLoadWindowTile() {
	if (!ppuIsWindowVisible()){
		return;
	}
	
	if ((fifo_fetch_x + 7) >= lcd_win_x && (fifo_fetch_x + 7) < (lcd_win_x + YRES + 14)){
		if (lcd_ly >= lcd_win_y && lcd_ly < (lcd_win_y + /*XRES*/YRES)){
			let w_tile_y = ppu_window_line >> 3;
			
			fifo_bgw_fetch_data[0] = busRead(getLcdcWinMapArea() +
				((fifo_fetch_x + 7 - lcd_win_x) >> 3) +
				(w_tile_y << 5));
			
			if (getLcdcBgwDataArea() == 0x8800){
				fifo_bgw_fetch_data[0] += 128;
			}
		}
	}
}

function pipelineFetch() {
	switch (fifo_cur_fetch_state){
		case PFSTATE_TILE: {
			ppu_oam_fetched_entry_count = 0;
			
			if (getLcdcBgwEnable()){
				fifo_bgw_fetch_data[0] = busRead(
					getLcdcBgMapArea() + (fifo_map_x >> 3) +
					((fifo_map_y >> 3) * 32)
				);
				if (getLcdcBgwDataArea() == 0x8800){
					fifo_bgw_fetch_data[0] += 128;
				}
				
				pipelineLoadWindowTile();
			}
			
			if (getLcdcObjEnable() && ppu_oam_line_sprite_count){
				pipelineLoadSpriteTile();
			}
			
			fifo_cur_fetch_state = PFSTATE_DATA0;
			fifo_fetch_x += 8;
		}
		break;
		case PFSTATE_DATA0: {
			fifo_bgw_fetch_data[1] = busRead(
				getLcdcBgwDataArea() + (fifo_bgw_fetch_data[0] << 4) +
				fifo_tile_y
			);
			
			pipelineLoadSpriteData(0);
			
			fifo_cur_fetch_state = PFSTATE_DATA1;
		}
		break;
		case PFSTATE_DATA1: {
			fifo_bgw_fetch_data[2] = busRead(
				getLcdcBgwDataArea() + (fifo_bgw_fetch_data[0] << 4) +
				fifo_tile_y + 1
			);
			
			pipelineLoadSpriteData(1);
			
			fifo_cur_fetch_state = PFSTATE_IDLE;
		}
		break;
		case PFSTATE_IDLE: {
			fifo_cur_fetch_state = PFSTATE_PUSH;
		}
		break;
		case PFSTATE_PUSH: {
			if (pipelinePixelAdd()){
				fifo_cur_fetch_state = PFSTATE_TILE;
			}
		}
		break;
	}
}

function pipelinePushPixel() {
	if (fifo_state_size > 8){
		let pixel_data = pixelFifoPop();
		
		if (fifo_line_x >= (lcd_scroll_x % 8)){
			// Rendering to Actual Video Buffer
			D_BUFFER32[fifo_pushed_x + (lcd_ly*XRES)] = pixel_data;
			
			fifo_pushed_x++;
		}
		
		fifo_line_x++;
	}
}

function pipelineProcess() {
	fifo_map_y = (lcd_ly + lcd_scroll_y);
	fifo_map_x = (fifo_fetch_x + lcd_scroll_x);
	fifo_tile_y = ((lcd_ly + lcd_scroll_y) & 0b111) * 2;
	
	if (!(ppu_lines_tick & 1)){
		pipelineFetch();
	}
	
	pipelinePushPixel();
}

function pipelineFifoReset() {
	while (fifo_state_size){
		pixelFifoPop();
	}
	fifo_state_head = fifo_state_tail = 0;
}


/*
	Display Rendering Processes
*/

const LINES_PER_FRAME = 154;
const TICKS_PER_LINE = 456;
const YRES = 144;
const XRES = 160;


function ppuIsWindowVisible() {
	return getLcdcWinEnable() && (lcd_win_x >= 0) && (lcd_win_x <= 166) && (lcd_win_y >= 0) && (lcd_win_y < YRES);
}

function ppuIncrementLy() {
	if (ppuIsWindowVisible() && lcd_ly >= lcd_win_y && lcd_ly < (lcd_win_y + YRES)){
		ppu_window_line++;
	}
	
	lcd_ly++;
	
	if (lcd_ly == lcd_ly_compare){
		setLcdsLyc(1);
		
		if (getLcdsStatInt(LCDS_INT_LYC)){
			cpuRequestInterrupt(INTR_LCD_STAT);
		}
	}
	else{
		setLcdsLyc(0);
	}
}

function ppuLoadLineSprites() {
	let cur_y = lcd_ly;
	let sprite_height = getLcdcObjHeight();
	
	ppu_oam_line_entry_array.fill(0);
	
	for (let i=0; i<40; i++){
		let entry = i*4;
		let e_y = ppu_oam_ram[entry];
		let e_x = ppu_oam_ram[entry+1];
		let e_tile = ppu_oam_ram[entry+2];
		let e_flags = ppu_oam_ram[entry+3];
		
		if (!e_x){
			continue;
		}
		
		if (ppu_oam_line_sprite_count >= 10){
			break;
		}
		
		if (e_y <= (cur_y + 16) && (e_y + sprite_height) > (cur_y + 16)){
			//ppu_oam_line_entry_array[ppu_oam_line_sprite_count] = entry;
			//ppu_oam_line_sprite_count++;
			
			// Doing some sorting
			for (let s=0; s<ppu_oam_line_sprite_count; s++){
				let ce = ppu_oam_line_sprites[s];
				let ce_x = ppu_oam_ram[ce+1];
				
				if (e_x < ce_x){
					let tmp_e = entry;
					
					ppu_oam_line_sprite_count++;
					for (let r=s; r<ppu_oam_line_sprite_count; r++){
						let old_e = ppu_oam_line_sprites[r];
						ppu_oam_line_sprites[r] = tmp_e;
						tmp_e = old_e;
					}
					break;
				}
				else if (s == (ppu_oam_line_sprite_count-1) && (s < 9)){
					ppu_oam_line_sprite_count++;
					ppu_oam_line_sprites[s + 1] = entry;
					break;
				}
			}
			if (ppu_oam_line_sprite_count==0){
				ppu_oam_line_sprites[0] = entry;
				ppu_oam_line_sprite_count++;
			}
		}
	}
}

function ppuModeOam() {
	if (ppu_lines_tick >= 80){
		setLcdsMode(LCD_MODE_XFER);
		
		fifo_cur_fetch_state = PFSTATE_TILE;
		fifo_line_x = 0;
		fifo_fetch_x = 0;
		fifo_pushed_x = 0;
		fifo_fifo_x = 0;
	}
	
	if (ppu_lines_tick == 1){
		ppu_oam_line_sprite_count = 0;
		ppuLoadLineSprites();
		if (ppu_oam_line_sprite_count){
			//notImplemented("What about?");
			//mark_line = ppu_oam_line_sprite_count;
		}
	}
}

function ppuModeXfer() {
	pipelineProcess();
	
	if (fifo_pushed_x >= XRES){
		pipelineFifoReset();
		setLcdsMode(LCD_MODE_HBLANK);
		
		if (getLcdsStatInt(LCDS_INT_HBLANK)){
			cpuRequestInterrupt(INTR_LCD_STAT);
		}
	}
}

function ppuModeVblank() {
	if (ppu_lines_tick >= TICKS_PER_LINE){
		ppuIncrementLy();
		
		if (lcd_ly >= LINES_PER_FRAME){
			setLcdsMode(LCD_MODE_OAM);
			lcd_ly = 0;
			ppu_window_line = 0;
			//mark_line = 0;
		}
		
		ppu_lines_tick = 0;
	}
}

function ppuModeHblank() {
	if (ppu_lines_tick >= TICKS_PER_LINE){
		ppuIncrementLy();
		
		if (lcd_ly >= YRES){
			setLcdsMode(LCD_MODE_VBLANK);
			
			cpuRequestInterrupt(INTR_VBLANK);
			
			if (getLcdsStatInt(LCDS_INT_VBLANK)){
				cpuRequestInterrupt(INTR_LCD_STAT);
			}
			
			ppu_current_frame++;
			
			// Framerate Control goes below...
			// delay();
			//console.log("End of Frame!");
		}
		else{
			setLcdsMode(LCD_MODE_OAM);
		}
		
		ppu_lines_tick = 0;
	}
}


/*
	Control Functions
*/

function ppuInit() {
	ppu_current_frame = 0;
	ppu_lines_tick = 0;
	ppu_window_line = 0;
	
	ppu_oam_fetched_entry_count = 0;
	
	fifo_line_x = 0;
	fifo_pushed_x = 0;
	fifo_fetch_x = 0;
	fifo_state_head = 0;
	fifo_state_tail = 0;
	fifo_state_size = 0;
	fifo_cur_fetch_state = PFSTATE_TILE;
	
	lcdInit();
	setLcdsMode(LCD_MODE_OAM);
	
	ppu_oam_ram.fill(0);
	ppu_vram.fill(0);
	D_BUFFER32.fill(0x0);
}

function ppuTick() {
	ppu_lines_tick++;
	
	switch (getLcdsMode()){
		case LCD_MODE_OAM: {
			ppuModeOam();
		}
		break;
		case LCD_MODE_XFER: {
			ppuModeXfer();
		}
		break;
		case LCD_MODE_VBLANK: {
			ppuModeVblank();
		}
		break;
		case LCD_MODE_HBLANK: {
			ppuModeHblank();
		}
		break;
	}
}

function ppuVramRead(adr) {
	return ppu_vram[adr];
}

function ppuVramWrite(adr, data) {
	ppu_vram[adr] = data;
}

function ppuOamRead(adr) {
	return ppu_oam_ram[adr];
}

function ppuOamWrite(adr, data) {
	ppu_oam_ram[adr] = data;
}
