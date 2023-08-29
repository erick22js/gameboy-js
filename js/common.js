
//
//	Settings
//

const LITTLE_ENDIAN = true;


//
//	Bit Manipulation
//

function bitSet(data, bit, state) {
	if(state) return data | (1<<bit);
	return data & ~(1<<bit);
}

function bitGet(data, bit) {
	return (data >> bit)&1;
}


//
//	Sizes conversion
//

function u8ToInt(data) {
	return data >= 0x80? data-0x100: data;
}

function u16ToInt(data) {
	return data >= 0x8000? data-0x10000: data;
}


//
//	Numbers Utility
//

function isBetween(val, min, max) {
	return val >= min && val <= max;
}

function reverse16(val) {
	return ((val&0xFF00) >> 8) | ((val&0x00FF) << 8);
}


//
//	API Base
//

function LOG(msg) {
	stdout.textContent += msg+"\n";
	stdout.scrollTo(0, stdout.textContent.length);
	//console.log(msg);
}

function notImplemented(msg=null) {
	if (msg){
		throw new Error("Functionality \'"+msg+"\' NOT implemented!");
	}
	else{
		throw new Error("Functionality NOT implemented!");
	}
}
