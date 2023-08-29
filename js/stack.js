
function stackPush(data) {
	cpu_reg_sp--;
	busWrite(cpu_reg_sp, data);
}

function stackPush16(data) {
	stackPush((data >> 8) & 0xFF);
	stackPush(data & 0xFF);
}

function stackPop() {
	var data = busRead(cpu_reg_sp);
	cpu_reg_sp++;
	return data;
}

function stackPop16() {
	return stackPop() | (stackPop() << 8);
}
