
let emu_running = false;
let emu_ticks = 0;

function emuCycles(cpu_cycles) {
	for (let c=0; c<cpu_cycles; c++){
		for (let i=0; i<4; i++){
			emu_ticks++;
			timerTick();
			ppuTick();
		}
		dmaTick();
	}
	return;
}

function emuInit() {
	timerInit();
	gamepadInit();
	ppuInit();
	cpuInit();
}

function emuRun() {
	while (true){
		if (emu_running){
			if (!cpuStep()){
				LOG("CPU Stopped!");
				return;
			}
		}
	}
}

function emuStep(steps=1, enable_logging=true) {
	let tlog = LOG;
	if (!enable_logging){
		LOG = function(){};
	}
	for (let i=0; i<steps; i++){
		if (emu_running){
			if (!cpuStep()){
				LOG("CPU Stopped!");
				return;
			}
		}
	}
	LOG = tlog;
}
