/* eslint-disable no-bitwise */
export const generateUUID = () => {
	let uuid = '';
	let ii;
	for (ii = 0; ii < 32; ii += 1) {
		switch (ii) {
			case 8:
			case 20:
				uuid += '-';
				uuid += (Math.random() * 16 | 0).toString(16);
				break;
			case 12:
				uuid += '-';
				uuid += '4';
				break;
			case 16:
				uuid += '-';
				uuid += (Math.random() * 4 | 8).toString(16);
				break;
			default:
				uuid += (Math.random() * 16 | 0).toString(16);
		}
	}
  
	return uuid;
};

export const generateGuid = () => {
	let result = '';
	let i;
	let j;
	for (j = 0; j < 32; j += 1) {
		i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
		result += i;
	}
	return result;
};
  
