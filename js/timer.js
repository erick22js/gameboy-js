

let timer_div = 0;
let timer_tima = 0;
let timer_tma = 0;
let timer_tac = 0;


function timerInit() {
	timer_div = 0xAC00;
	//timer_div = 0xABCC;
}

function timerTick() {
	let previous_div = timer_div;
	timer_div++;
	
	let timer_update = false;
	
	switch (timer_tac & 0b11){
		case 0b00: {
			timer_update = (previous_div & (1 << 9)) && (!(timer_div & (1 << 9)));
		}
		break;
		case 0b01: {
			timer_update = (previous_div & (1 << 3)) && (!(timer_div & (1 << 3)));
		}
		break;
		case 0b10: {
			timer_update = (previous_div & (1 << 5)) && (!(timer_div & (1 << 5)));
		}
		break;
		case 0b11: {
			timer_update = (previous_div & (1 << 7)) && (!(timer_div & (1 << 7)));
		}
		break;
	}
	
	if (timer_update && (timer_tac & (1 << 2))){
		timer_tima++;
		if (timer_tima == 0xFF){
			timer_tima = timer_tma;
			cpuRequestInterrupt(INTR_TIMER);
		}
	}
}
