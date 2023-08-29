
/*
	Properties
*/

let pad_button_sel = 0x0;
let pad_dir_sel = 0x0;

let pad_start = 0x0;
let pad_select = 0x0;
let pad_a = 0x0;
let pad_b = 0x0;
let pad_up = 0x0;
let pad_down = 0x0;
let pad_left = 0x0;
let pad_right = 0x0;

function gamepadInit() {
	
}

function gamepadButtonSel() {
	return pad_button_sel;
}

function gamepadDirSel() {
	return pad_dir_sel;
}

function gamepadSetSel(value) {
	pad_button_sel = value & 0x20;
	pad_dir_sel = value & 0x10;
}

function gamepadGetOutput() {
	let output = 0xCF;
	
	if (!gamepadButtonSel()){
		if (pad_start){
			output &= ~(1<<3);
		}
		if (pad_select){
			output &= ~(1<<2);
		}
		if (pad_a){
			output &= ~(1<<0);
		}
		if (pad_b){
			output &= ~(1<<1);
		}
	}
	
	if (!gamepadDirSel()){
		if (pad_left){
			output &= ~(1<<1);
		}
		if (pad_right){
			output &= ~(1<<0);
		}
		if (pad_up){
			output &= ~(1<<2);
		}
		if (pad_down){
			output &= ~(1<<3);
		}
	}
	
	return output;
}


window.addEventListener('keydown', function(ev){
	if (ev.key == 'w'){
		pad_up = 1;
	}
	if (ev.key == 'a'){
		pad_left = 1;
	}
	if (ev.key == 's'){
		pad_down = 1;
	}
	if (ev.key == 'd'){
		pad_right = 1;
	}
	if (ev.key == 'o'){
		pad_a = 1;
	}
	if (ev.key == 'p'){
		pad_b = 1;
	}
	if (ev.key == 't'){
		pad_select = 1;
	}
	if (ev.key == 'y'){
		pad_start = 1;
	}
});

window.addEventListener('keyup', function(ev){
	if (ev.key == 'w'){
		pad_up = 0;
	}
	if (ev.key == 'a'){
		pad_left = 0;
	}
	if (ev.key == 's'){
		pad_down = 0;
	}
	if (ev.key == 'd'){
		pad_right = 0;
	}
	if (ev.key == 'o'){
		pad_a = 0;
	}
	if (ev.key == 'p'){
		pad_b = 0;
	}
	if (ev.key == 't'){
		pad_select = 0;
	}
	if (ev.key == 'y'){
		pad_start = 0;
	}
});
