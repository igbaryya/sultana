import { createStore, initReducers } from './reduxBase';
import modules from './modules';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { ApplicationInstances, ReduxStoreOptions } from './interfaces/sdkInterface';
import { GlobalSpinner } from 'sdk/connector/globalSpinner';

let instance: ApplicationInstances;
let reduxStore: ToolkitStore;

export const getStore = () => {
	return reduxStore;
};
const createInstance = (options?: ReduxStoreOptions) => {
	const reducerMap: Record<string, Function> = {};
	const instances: any = {};
	Object.keys(modules).forEach((key1) => {
		const obj = modules[key1];
		instances[key1] = obj.class;
		reducerMap[key1] = obj.reducer;
	});
	reduxStore = options?.store || getStore() || createStore({}, reducerMap);
	initReducers(reducerMap);
	if (!instance) {
		Object.keys(instances).forEach((key) => {
			instances[key] = new instances[key](reduxStore);
		});
		instance = { ...instances };
	}
	return instance;
};

const initGlobals = () => {
	GlobalSpinner.getInstance().init(instance);
};

export const sdkInstance = () => instance;
export const getInstance = (options?: ReduxStoreOptions) => {
	if (!instance) {
		instance = createInstance(options);
	}
	initGlobals();
	return instance;
};
