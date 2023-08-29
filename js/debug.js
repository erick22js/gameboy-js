
let dbg_msg = "";
let dbg_size = 0;
let dbg_lsize = 0;

function dbgUpdate() {
	if (busRead(0xFF02) == 0x81){
		dbg_msg += String.fromCharCode(busRead(0xFF01));
		dbg_size++;
		busWrite(0xFF02, 0);
	}
}

function dbgPrint() {
	if (dbg_size != dbg_lsize){
		console.log("DEBUG_MESSAGE: "+dbg_msg);
		dbg_lsize = dbg_size;
	}
}
