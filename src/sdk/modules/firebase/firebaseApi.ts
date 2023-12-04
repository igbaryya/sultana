import { FirebaseApp, initializeApp } from 'firebase/app';
import { Timestamp } from 'firebase/firestore';
import {
	getDatabase, ref, child, get, set, push, update, remove, onValue, limitToLast, query, orderByChild, equalTo, startAt, endAt, DataSnapshot
} from 'firebase/database';
import {
	Auth, browserPopupRedirectResolver, browserSessionPersistence, initializeAuth
} from 'firebase/auth';
import {
	getDownloadURL, getStorage, uploadBytes, ref as storageRef
} from 'firebase/storage';

import * as selectors from './firebaseSelector';
import { ActionTypes, firebaseAuthentication, sliceName } from './firebaseConfig';
import BaseApi from 'sdk/reduxBase/baseApi';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

export default class FirebaseRefrenceApi extends BaseApi {
	public static instance: FirebaseRefrenceApi;
	name = 'FirebaseRefrenceApi';
	selectors: typeof selectors;
	firebase: FirebaseApp;
	auth: Auth;
	
	private constructor(store: ToolkitStore) {
		if (FirebaseRefrenceApi.instance) {
			return FirebaseRefrenceApi.instance;
		}
		super(store, ActionTypes, sliceName);
		FirebaseRefrenceApi.instance = this;
		this.selectors = selectors;
		this.setFBInstance();
	}

	setFBInstance = () => {
		this.authenticated();
	};

	getInstance = () => {
		return FirebaseRefrenceApi.instance;
	};

	getState = () => {
		return this.selectors.sliceSelector(this.store.getState());
	};

	asyncRead = async (root: string) => {
		const snapshot = await get(child(this.getDataBaseRef(), root));
		if (snapshot.exists()) {
			return snapshot.val();
		}
		return null;
	};

	asyncWrite = async (root: string, childs: any) => {
		await set(child(this.getDataBaseRef(), root), childs);
	};

	asyncPush = async (root: string, childs: any) => {
		const res = await push(child(this.getDataBaseRef(), root), childs);
		return res.key;
	};

	asyncUpdate = async (root: string, nameValue: object) => {
		await update(child(this.getDataBaseRef(), root), nameValue);
	};

	asyncDelete = async (root: string) => {
		await remove(child(this.getDataBaseRef(), root));
	};

	registerCall = (path: string, callback: (snapshot: DataSnapshot) => unknown, limit?: number, orderBy?: string, equalsTo?: string) => {
		const dbRef = this.getDataBaseRef(path);
		const queries = [];
		if (limit) {
			queries.push(limitToLast(limit));
		}
		if (orderBy) {
			queries.push(orderByChild(orderBy));
		}
		if (equalsTo) {
			queries.push(equalTo(equalsTo));
		}
		if (queries.length) {
			return onValue(query(dbRef, ...queries), callback);
		}
		return onValue(dbRef, callback);
	};

	getDataBaseRef = (path?: string) => {
		const realtimeDB = getDatabase(this.firebase);
		return ref(realtimeDB, path);
	};

	getAuthRef = () => {
		return this.auth;
	};

	authenticated = () => {
		if (this.firebase == null) {
			this.firebase = initializeApp(firebaseAuthentication);
			this._updateIndicator(!!this.firebase);
			this.auth = initializeAuth(this.firebase, {
				persistence: browserSessionPersistence,
				popupRedirectResolver: browserPopupRedirectResolver
			});
		}
	};

	getServerTimestamp = () => {
		return Timestamp.now();
	};

	asyncStorageUpload = async (path: string, blob: Blob | Uint8Array | ArrayBuffer) => {
		const result = await uploadBytes(this.getStorageRef(path), blob);
		return result;
	};

	getStorageRef = (path: string, bucketURI?: string) => {
		return storageRef(getStorage(this.firebase, bucketURI), path);
	};

	getDownloadURL = async (path: string) => {
		const res = await getDownloadURL(this.getStorageRef(path));
		return res;
	};

	searchOnce = async (root: string, key: string, value: any) => {
		const dbRef = this.getDataBaseRef(root);
		const snapshot = await get(query(dbRef, orderByChild(key), startAt(value), endAt(`${value}\uf8ff`)));
		if (snapshot.exists()) {
			return snapshot.val();
		}
		return null;
	};

	searchOnceExact = async (root: string, key: string, value: any) => {
		const dbRef = this.getDataBaseRef(root);
		const snapshot = await get(query(dbRef, orderByChild(key), equalTo(value)));
	  
		if (snapshot.exists()) {
		  return snapshot.val();
		}
		return null;
	};

	_updateIndicator = (indc: boolean) => {
		this.store.dispatch({
			type: ActionTypes.FB_IS_updateIndicator,
			payload: indc
		});
	};
}
