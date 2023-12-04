import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import mw from './redux-mw';
import eraseableReducer from './reducer.helper';
import { loadStoreFromStorage, subscribe } from './persister';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

export const storeMiddlewares = [thunk, mw];

const createStore = (initialState = {}, reducers: any, options = {}) => {
	const presistStore = { ...initialState, ...loadStoreFromStorage() };
	const rootReducer = eraseableReducer(combineReducers({ ...reducers }), options);
	const appEnhancers: any = [];
	const store: ToolkitStore = configureStore({
		reducer: rootReducer,
		preloadedState: presistStore,
		middleware: storeMiddlewares,
		enhancers: appEnhancers
	});
	return subscribe(store);
};

export default createStore;
