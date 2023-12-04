import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { throttle } from 'lodash';
import constants from './constant';
import { saveStoreToStorage } from './sessionStorageHandler';

export const subscribe = (reduxStore: ToolkitStore) => {
	reduxStore.subscribe(throttle(() => {
		saveStoreToStorage({
			...reduxStore.getState()
		});
	}, constants.STORE_TIME_OUT));
	return reduxStore;
};
