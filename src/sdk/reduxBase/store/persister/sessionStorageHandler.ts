import { Logger } from 'sdk/logger';
import constants from './constant';

export const loadStoreFromStorage = () => {
	if (!window || !window.sessionStorage) {
		return undefined;
	}
	try {
		const serializedStore = window.sessionStorage.getItem(constants.STORAGE_KEY_NAME);
		if (serializedStore === null) {
			return undefined;
		}
		return JSON.parse(serializedStore);
	} catch (err) {
		Logger.log('loadStoreFromStorage', 'Failed to load storage', 'error');
		return undefined;
	}
};

export const saveStoreToStorage = (store: Record<string, any>) => {
	if (!window || !window.sessionStorage) {
		return;
	}
	try {
		const serializedStore = JSON.stringify(store);
		window.sessionStorage.setItem(constants.STORAGE_KEY_NAME, serializedStore);
	} catch (err) {
		Logger.log('saveStoreToStorage', 'Failed to save to storage', 'error');
	}
};
