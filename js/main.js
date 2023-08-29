'use strict';

window.onload = function() {
	LOG("Press Ctrl+B to load a rom"); LOG("Press Enter to start reproducing");
	LOG("");
}

let speed = 1;
function update() {
	emuStep(0x4000 * speed, true);
	refreshUi();
	requestAnimationFrame(update);
}

window.onkeydown = function(ev){
	if (ev.key == 'b' && ev.ctrlKey){
		cartLoad(update);
		return false;
	}
	if (ev.key == 'Enter'){
		emu_running = !emu_running;
	}
	if (ev.key == 'j'){
		speed /= 2;
	}
	if (ev.key == 'l'){
		speed *= 2;
	}
	if (ev.key == 'F8'){
		cpuStep(true);
	}
}
