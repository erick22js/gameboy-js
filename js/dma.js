
/*
	Properties
*/

let dma_active = false;
let dma_byte = 0x0;
let dma_value = 0x0;
let dma_start_delay = 0x0;


/*
	Working Methods
*/

function dmaStart(start_value) {
	dma_active = true;
	dma_byte = 0x0;
	dma_start_delay = 2;
	dma_value = start_value;
}

function dmaTick() {
	if (!dma_active){
		return;
	}
	
	if (dma_start_delay){
		dma_start_delay--;
		return;
	}
	
	ppuOamWrite(dma_byte, busRead((dma_value * 0x100) + dma_byte));
	dma_byte++;
	dma_active = dma_byte < 0xA0;
}

function dmaTransferring() {
	return dma_active;
}
