import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import BaseApi from 'sdk/reduxBase/baseApi';
import { ActionTypes, sliceName } from './loginConfig';
import * as selectors from './loginSelector';
import { OPERATIONS_OFFICER_TABLE } from 'consts/firebase';
import FirebaseRefrenceApi from '../firebase/firebaseApi';

export default class LoginApi extends BaseApi {
	firebaseApi: FirebaseRefrenceApi;
	constructor(store: ToolkitStore) {
		super(store, ActionTypes, sliceName);
		this.firebaseApi = FirebaseRefrenceApi.instance;
	}
	
	getCurrentUser() {
		return selectors.currentUserSelector(this.store.getState());
	}

	retrieveUser = async () => {
		const fbUID = window.localStorage.getItem('fbUID');
		if (!fbUID) {
			return null;
		}
		const res = await this.firebaseApi.asyncRead(`${OPERATIONS_OFFICER_TABLE}/${fbUID}`);
		this.dispatchAction(ActionTypes.UPDATE_CURRENT_USER, res);
		return res;
	};

	clearUser = async () => {
		this.dispatchAction(ActionTypes.UPDATE_CURRENT_USER, {});
	};

	userHook = () => {
		const fbUID = window.localStorage.getItem('fbUID');
		if (!fbUID) {
			return () => {};
		}
		return this.firebaseApi.registerCall(`${OPERATIONS_OFFICER_TABLE}/${fbUID}`, (snapshot) => {
			this.dispatchAction(ActionTypes.UPDATE_CURRENT_USER, snapshot.val());
		});
	};

	isAuthorizedEmail = async (email: string) => {
		if (!email || !email.trim()) {
			return null;
		}
		const res = await this.firebaseApi.searchOnce(OPERATIONS_OFFICER_TABLE, 'email', email.toLowerCase());
		if (res) {
			const fbUID = Object.keys(res)[0];
			window.localStorage.setItem('fbUID', fbUID);
			return res[fbUID];
		}
		return null;
	};

	initLoggedInUser = async () => {
		const fbUID = window.localStorage.getItem('fbUID');
		if (!fbUID) {
			return;
		}
		const res = await this.retrieveUser();
		
		await this.firebaseApi.asyncUpdate(`${OPERATIONS_OFFICER_TABLE}/${fbUID}`, {
			currentAuthDate: new Date(),
			lastAuthDate: res?.currentAuthDate || new Date()
		});
	};
	updateHelloWorldMsg(newMsg: string) {
		this.store.dispatch({ type: ActionTypes.UPDATE_HELLO_WORLD, payload: this._validateHelloWorldMsg(newMsg) });
		return this.sdkResponser.success();
	}

	_validateHelloWorldMsg(msg: string) {
		return msg || 'Hello Wolrd';
	}
	
	isSendToSMS = () => selectors.sendToSMSSelector(this.store.getState());
	isLogInByGoogle = () => selectors.byGoogleLoginSelector(this.store.getState());
	setSendBySMS = (flag: boolean) => {
		this.dispatchAction(ActionTypes.UPDATE_OTP_TARGET_TO_SMS, flag);
	};
	setByGoogleSignIn = (flag: boolean) => {
		this.dispatchAction(ActionTypes.UPDATE_LOGIN_BY_GOOGLE, !!flag);
	};
}
