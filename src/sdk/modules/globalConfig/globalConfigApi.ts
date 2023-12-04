import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import globalSpinner from 'sdk/connector/globalSpinner';
import { Logger } from 'sdk/logger';
import BaseApi from 'sdk/reduxBase/baseApi';
import {
	ActionTypes,
	sliceName,
	BE_PREFIX,
	TESTING_ENDPOINTS_RGX
} from './globalConfigConfig';
import { BaseUrl } from './globalConfigInterface';
import * as selectors from './globalConfigSelector';
import FirebaseRefrenceApi from '../firebase/firebaseApi';
import { APP_SETTINGS_TABLE } from 'consts/firebase';

/**
 * @author ahmadig
 * @description SDK Framework Global Configurations
 */
export default class GlobalConfigApi extends BaseApi {
	firebaseApi: FirebaseRefrenceApi;
	constructor(store: ToolkitStore) {
		super(store, ActionTypes, sliceName);
		this.setGlobalSpinnerVisibility = this.setGlobalSpinnerVisibility.bind(this);
		this.isGlobalSpinnerVisible = this.isGlobalSpinnerVisible.bind(this);
		this.firebaseApi = FirebaseRefrenceApi.instance;
	}

	getBaseURL = () => {
		return selectors.baseUrlSelector(this.store.getState());
	};

	updateSessionAuth = (auth: string) => {
		this.dispatchAction(ActionTypes.UPDATE_SESSION_AUTH, auth);
		return this.sdkResponser.success();
	};
	
	getSesssionAuth = () => {
		return selectors.sessionAuthSelector(this.store.getState());
	};

	setGlobalSpinnerVisibility(flag?: boolean) {
		this.dispatchAction(ActionTypes.SET_SPINNER_VISIBILITY, !!flag);
	}

	isGlobalSpinnerVisible() {
		return !!selectors.isSpinnerVisible(this.store.getState());
	}

	updateBaseUrl(newBaseUrl: string) {
		const builtUrl = this._buildURL(newBaseUrl);
		if (!builtUrl) {
			return this.sdkResponser.error('BASE_URL_FAILURE', `Failed to build ${newBaseUrl}`);
		}
		if (!this.dispatchAction(ActionTypes.UPDATE_BASE_URL, builtUrl)) {
			this.sdkResponser.error('BASE_URL_FAILURE', `Failed to dispatch ${newBaseUrl}`);
		}
		return this.sdkResponser.success();
	}

	hideSpinner() {
		globalSpinner.clear();
		this.dispatchAction(ActionTypes.SET_SPINNER_VISIBILITY, false);
	}

	loadHotels = () => {
		return this.firebaseApi.registerCall(`${APP_SETTINGS_TABLE}/hotels`, (snapshot) => {
			const allHotels = snapshot.val();
			this.dispatchAction(ActionTypes.UPDATE_HOTELS, allHotels);
		});
	};
	loadSchools = () => {
		return this.firebaseApi.registerCall(`${APP_SETTINGS_TABLE}/schools`, (snapshot) => {
			const allSchools = snapshot.val();
			this.dispatchAction(ActionTypes.UPDATE_SCHOOLS, allSchools);
		});
	};

	_buildURL(newUrl: string): BaseUrl | null {
		let url;
		try {
			url = new URL(!newUrl.startsWith('http') ? `http://${newUrl}` : newUrl);
		} catch (err) {
			Logger.log(sliceName, `Failed to build URL: ${newUrl}...`, 'warn');
			Logger.log(sliceName, err, 'error');
			return null;
		}
		return {
			host: url.host,
			port: url.port,
			protocol: url.protocol,
			graphqlUrl: `${url.origin}/${BE_PREFIX}`,
			isTestingEndpoint: TESTING_ENDPOINTS_RGX.test(newUrl)
		};
	}
}
