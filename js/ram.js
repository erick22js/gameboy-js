
let wram_data = new Uint8Array(0x2000 * 16);
let hram_data = new Uint8Array(0x80);


function wramRead(adr) {
	if (adr >= 0x2000){
		LOG("INVALID READ At Wram in Offset "+(adr+0xC000));
		return 0;
	}
	return wram_data[adr];
}

function wramWrite(adr, data) {
	if (adr >= 0x2000){
		LOG("INVALID WRITE At Wram in Offset "+(adr+0xC000));
		return;
	}
	wram_data[adr] = data;
}

function hramRead(adr) {
	return hram_data[adr];
}

function hramWrite(adr, data) {
	hram_data[adr] = data;
}
