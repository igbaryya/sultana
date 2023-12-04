import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import SDKResponser from 'sdk/common/responses';
import Fetcher from 'sdk/connector/axiosHandler';
import { CallOptions, GrapqlData } from 'sdk/connector/axiosHandler/interface';
import { sdkInstance } from 'sdk';
import { ApplicationInstances } from 'sdk/interfaces/sdkInterface';

export default class BaseApi {
	constructor(store: ToolkitStore, actions: Record<string, string>, sliceName: string) {
		this.store = store;
		this.sdkResponser = new SDKResponser(this._dispatchError.bind(this), sliceName);
		this.sliceName = sliceName;
		this.actions = actions;
		this.sdkInstance = sdkInstance();
	}

	getState() {
		return this.store.getState()[this.sliceName];
	}

	dispatchAction(action: string, payload?: any) {
		if (!this.actions[action]) {
			return 0;
		}
		this.store.dispatch({ type: this.actions[action], payload });
		return 1;
	}
    
	_dispatchError(errorCode: string, description?: string) {
		if (errorCode) {
			this.dispatchAction(this.actions.UPDATE_API_ERROR, { errorCode, description });
		} else {
			this.dispatchAction(this.actions.CLEAR_API_ERROR);
		}
	}

	async fetch(data: GrapqlData | GrapqlData[], options?: CallOptions) {
		let response: any | null | null[];
		if (Array.isArray(data)) {
			response = await Promise.all(data.map((d) => Fetcher.call(d, options)));
		} else {
			response = await Fetcher.call(data, options);
		}
		return response;
	}

	fetchAsync(data: GrapqlData | GrapqlData[], callback: ((response: any | null) => void), options?: CallOptions) {
		this.fetch(data, { ...options, skipSpinner: options?.skipError ?? true }).then(callback);
	}

	store: ToolkitStore;
	sliceName: string;
	actions: Record<string, string>;
	sdkResponser: SDKResponser;
	sdkInstance: ApplicationInstances;
}
