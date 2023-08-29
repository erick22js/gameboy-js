
//
//	Cart Constants
//

const ROM_TYPE = [
	"ROM ONLY",
	"MBC1",
	"MBC1+RAM",
	"MBC1+RAM+BATTERY",
	"0x04: ???",
	"MCB2",
	"MCB2+BATTERY",
	"0x07: ???",
	"ROM+RAM 1",
	"ROM+RAM+BATTERY 1",
	"0x0A: ???",
	"MMM01",
	"MMM01+RAM",
	"MMM01+RAM+BATTERY",
	"0x0E: ???",
	"MCB3+TIMER+BATTERY",
	"MCB3+TIMER+RAM+BATTERY 2",
	"MCB3",
	"MCB3+RAM 2",
	"MCB3+RAM+BATTERY 2",
	"0x14: ???",
	"0x15: ???",
	"0x16: ???",
	"0x17: ???",
	"0x18: ???",
	"MBC5",
	"MBC5+RAM",
	"MBC5+RAM+BATTERY",
	"MBC5+RUMBLE",
	"MBC5+RUMBLE+RAM",
	"MBC5+RUMBLE+RAM+BATTERY",
	"0x1F: ???",
	"MBC6",
	"0x21: ???",
	"MCB7+SENSOR+RUMBLE+RAM+BATTERY",
];

const LIC_CODE = {
	0x00: "None",
	0x01: "Nintendo",
	0x08: "Capcom",
	0x09: "Hot-B",
	0x0A: "Jaleco",
	0x0B: "Coconuts Japan",
	0x0C: "Elite Systems",
	0x13: "EA (Eletronic Arts)",
	0x18: "Hudsonsoft",
	0x19: "ITC Entertainment",
	0x1A: "Yanoman",
	0x1F: "Virgin Interactive",
	0x24: "PCM Complete",
	0x25: "San-X",
	0x28: "Kotobuki Systems",
	0x29: "Seta",
	0x30: "Infogrames",
	0x31: "Nintendo",
	0x32: "Bandai",
	0x33: "<Indicates that the New licensee code should be used instead.>",
	0x34: "Konami",
	0x35: "HectorSoft",
	0x38: "Capcom",
	0x39: "Banpresto",
	0x3C: ".Entertainment i",
	0x3E: "Gremlin",
	0x41: "Ubisoft",
	0x42: "Atlus",
	0x44: "Malibu",
	0x46: "Angel",
	0x47: "Spectrum Holoby",
	0x49: "Irem",
	0x4A: "Virgin Interactive",
	0x4D: "Malibu",
	0x4F: "U.S. Gold",
	0x50: "Absolute",
	0x51: "Acclaim",
	0x52: "Activision",
	0x53: "American Sammy",
	0x54: "GameTek",
	0x55: "Park Place",
	0x56: "LJN",
	0x57: "Matchbox",
	0x59: "Milton Bradley",
	0x5A: "Mindscape",
	0x5B: "Romstar",
	0x5C: "Naxat Soft",
	0x5D: "Tradewest",
	0x60: "Titus",
	0x61: "Virgin Interactive",
	0x67: "Ocean Interactive",
	0x69: "EA (Electronic Arts)",
	0x6E: "Elite Systems",
	0x6F: "Electro Brain",
	0x70: "Infogrames",
	0x71: "Interplay",
	0x72: "Broderbund",
	0x73: "Sculptered Soft",
	0x75: "The Sales Curve",
	0x78: "t.hq",
	0x79: "Accolade",
	0x7A: "Triffix Entertainment",
	0x7C: "Microprose",
	0x7F: "Kemco",
	0x80: "Misawa Entertainment",
	0x83: "Lozc",
	0x86: "Tokuma Shoten Intermedia",
	0x8B: "Bullet-Proof Software",
	0x8C: "Vic Tokai",
	0x8E: "Ape",
	0x8F: "I’Max",
	0x91: "Chunsoft Co.",
	0x92: "Video System",
	0x93: "Tsubaraya Productions Co.",
	0x95: "Varie Corporation",
	0x96: "Yonezawa/S’Pal",
	0x97: "Kaneko",
	0x99: "Arc",
	0x9A: "Nihon Bussan",
	0x9B: "Tecmo",
	0x9C: "Imagineer",
	0x9D: "Banpresto",
	0x9F: "Nova",
	0xA1: "Hori Electric",
	0xA2: "Bandai",
	0xA4: "Konami",
	0xA6: "Kawada",
	0xA7: "Takara",
	0xA9: "Technos Japan",
	0xAA: "Broderbund",
	0xAC: "Toei Animation",
	0xAD: "Toho",
	0xAF: "Namco",
	0xB0: "acclaim",
	0xB1: "ASCII or Nexsoft",
	0xB2: "Bandai",
	0xB4: "Square Enix",
	0xB6: "HAL Laboratory",
	0xB7: "SNK",
	0xB9: "Pony Canyon",
	0xBA: "Culture Brain",
	0xBB: "Sunsoft",
	0xBD: "Sony Imagesoft",
	0xBF: "Sammy",
	0xC0: "Taito",
	0xC2: "Kemco",
	0xC3: "Squaresoft",
	0xC4: "Tokuma Shoten Intermedia",
	0xC5: "Data East",
	0xC6: "Tonkinhouse",
	0xC8: "Koei",
	0xC9: "UFL",
	0xCA: "Ultra",
	0xCB: "Vap",
	0xCC: "Use Corporation",
	0xCD: "Meldac",
	0xCE: ".Pony Canyon or",
	0xCF: "Angel",
	0xD0: "Taito",
	0xD1: "Sofel",
	0xD2: "Quest",
	0xD3: "Sigma Enterprises",
	0xD4: "ASK Kodansha Co.",
	0xD6: "Naxat Soft",
	0xD7: "Copya System",
	0xD9: "Banpresto",
	0xDA: "Tomy",
	0xDB: "LJN",
	0xDD: "NCS",
	0xDE: "Human",
	0xDF: "Altron",
	0xE0: "Jaleco",
	0xE1: "Towa Chiki",
	0xE2: "Yutaka",
	0xE3: "Varie",
	0xE5: "Epcoh",
	0xE7: "Athena",
	0xE8: "Asmik ACE Entertainment",
	0xE9: "Natsume",
	0xEA: "King Records",
	0xEB: "Atlus",
	0xEC: "Epic/Sony Records",
	0xEE: "IGS",
	0xF0: "A Wave",
	0xF3: "Extreme Entertainment",
	0xFF: "LJN"
};

//
//	Cart Information
//

var cart_entry = 0x0;
var cart_logo = new Uint8Array();

var cart_title = "";
var cart_manufaturer_code = "";
var cart_cgb_flag = 0x0;
var cart_new_license_code = 0x0;
var cart_sgb_flag = 0x0;
var cart_type = 0x0;
var cart_rom_size = 0x0;
var cart_ram_size = 0x0;
var cart_destination_code = 0x0;
var cart_license_code = 0x0;
var cart_version = 0x0;
var cart_checksum = 0x0;
var cart_global_checksum = 0x0;

//
//	Rom Informations
//

let cart_rom_data = new Uint8Array(0x0);
let cart_ram_data = new Uint8Array(0x2000);

let ram_enabled = true;
let ram_banking = true;

let rom_bank_value = 0x0;
let rom_bank = 0x1;
let rom_bank_adr = 0x4000;
let banking_mode = 0x0;

let ram_bank = 0x0;
let ram_bank_value = 0x0;
let ram_bank_adr = 0x0;

let cart_battery = false;
let cart_need_save = false;


function isCartMbc1() {
	return cart_type >= 1 && cart_type <= 3;
}

function isCartBattery() {
	return cart_type == 3;
}

function cartLoad(callback=function(){}) {
	//let file = File.openBuffer(base64ToBytesArr(finalfantasy));
	File.pickBuffer(function(files){
		let file = files[0];
		cart_rom_data = file.toBinary();
		
		file.seekSet(0x100); cart_entry = file.read32();
		cart_logo = file.toBinary(0x103, 0x30);
		file.seekSet(0x134); cart_title = file.readString(0x10); LOG("Cart Title: "+(cart_title?cart_title:"-unknown-"));
		file.seekSet(0x13F); cart_manufaturer_code = file.readString(4); LOG("Manufaturer Code: "+(cart_manufaturer_code?cart_manufaturer_code:"-unknown-"));
		file.seekSet(0x143); cart_cgb_flag = file.read8(); LOG(cart_cgb_flag==0x80? "CGB Retrocompatible": cart_cgb_flag==0xC0? "CGB Only": "Not CGB");
		file.seekSet(0x144); cart_new_license_code = file.read16(); LOG("New license code: -");
		file.seekSet(0x146); cart_sgb_flag = file.read8(); LOG(cart_sgb_flag == 0x03? "Supports SGB Functions": "Does not support SGB Functions");
		file.seekSet(0x147); cart_type = file.read8(); LOG("Cart Type: "+(ROM_TYPE[cart_type]? ROM_TYPE[cart_type]: "Not Defined (0x"+(cart_type.toString(16))+")") + (cart_type < 0x04? " (SUPPORTED)": " (UNSUPPORTED)"));
		file.seekSet(0x148); cart_rom_size = file.read8(); LOG("Rom Size: "+(cart_rom_size==0x00? "32KiB (no banking), 2 banks": cart_rom_size==0x01? "64KiB, 4 banks": cart_rom_size==0x02? "128KiB, 8 banks": cart_rom_size==0x03? "256KiB, 16 banks": cart_rom_size==0x04? "512KiB, 32 banks": cart_rom_size==0x05? "1MiB, 64 banks": cart_rom_size==0x06? "2MiB, 128 banks": cart_rom_size==0x07? "4MiB, 256 banks": cart_rom_size==0x08? "8MiB, 512 banks": cart_rom_size==0x52? "1.1MiB, 72 banks": cart_rom_size==0x53? "1.2MiB, 80 banks": cart_rom_size==0x54? "1.5MiB, 96 banks": "-unknown-"));
		file.seekSet(0x149); cart_ram_size = file.read8(); LOG("Cart Ram Size: "+(cart_ram_size==0x00? "No RAM": cart_ram_size==0x01? "Unused RAM": cart_ram_size==0x02? "8 KiB, 1 bank": cart_ram_size==0x03? "32 KiB, 4 banks": cart_ram_size==0x04? "128 KiB, 16 banks": cart_ram_size==0x05? "64 KiB, 8 banks": "-unknown-"));
		file.seekSet(0x14A); cart_destination_code = file.read8(); LOG("Destination: "+(cart_destination_code==0x00? "Japan (and possibly overseas)": cart_destination_code==0x01? "Overseas only": "-unknown-"));
		file.seekSet(0x14B); cart_license_code = file.read8(); LOG("Old License Code: "+(LIC_CODE[cart_license_code]? LIC_CODE[cart_license_code]: "-unknown-"));
		file.seekSet(0x14C); cart_version = file.read8(); LOG("Cart Version: "+cart_version);
		file.seekSet(0x14D); cart_checksum = file.read8(); LOG("Cart Checksum Header: 0x"+cart_checksum.toString(16).toUpperCase());
		file.seekSet(0x14E); cart_global_checksum = file.read16(); LOG("Cart Checksum Global: 0x"+cart_global_checksum.toString(16).toUpperCase());
		LOG("");
		
		cart_battery = isCartBattery();
		cart_need_save = false;
		
		if (cart_battery){
			cartBatteryLoad();
		}
		
		let c = 0;
		for (let i = 0x0134; i <= 0x014C; i++){
			c = c - cart_rom_data[i] - 1;
		}
		if ((c&0xFF) == cart_checksum){
			LOG("Header Checksum PASSED!");
		}
		else{
			LOG("Header Checksum FAILED!");
		}
		LOG("");
		
		emuInit();
		callback();
	}, false);
}

function cartBatteryLoad() {
	// TODO: Game Load
}

function cartBatterySave() {
	// TODO: Game Save
}

function cartRead(addr) {
	//return cart_rom_data[addr];
	if (!isCartMbc1() || addr < 0x4000){
		return cart_rom_data[addr];
	}
	if ((addr & 0xE000) == 0xA000){
		if (!ram_enabled){
			return 0xFF;
		}
		if (ram_bank == -1){
			return 0xFF;
		}
		return cart_ram_data[addr - 0xA000 + ram_bank_adr];
	}
	
	return cart_rom_data[addr - 0x4000 + rom_bank_adr];
}

function cartWrite(addr, data) {
	if (!isCartMbc1()){
		return;
	}
	if (addr < 0x2000){
		ram_enabled = ((data & 0xF) == 0xA);
	}
	if ((addr & 0xE000) == 0x2000){
		if (data == 0){
			data = 1;
		}
		data &= 0b11111;
		
		rom_bank = data;
		rom_bank_adr = 0x4000 * rom_bank;
	}
	if ((addr & 0xE000) == 0x4000){
		ram_bank_value = data & 0b11;
		if (ram_banking){
			if (cart_need_save){
				cartBatterySave();
			}
			ram_bank = ram_bank_value;
			ram_bank_adr = (ram_bank * 0x2000);
		}
	}
	if ((addr & 0xE000) == 0x6000){
		banking_mode = data & 1;
		ram_banking = banking_mode;
		if (ram_banking){
			if (cart_need_save){
				cartBatterySave();
			}
			ram_bank = ram_bank_value;
			ram_bank_adr = (ram_bank * 0x2000);
		}
	}
	if ((addr & 0xE000) == 0xA000){
		if (!ram_enabled){
			return;
		}
		if (ram_bank == -1){
			return;
		}
		cart_ram_data[addr - 0xA000 + ram_bank_adr] = data;
		if (cart_battery){
			cart_need_save = true;
		}
	}
}
