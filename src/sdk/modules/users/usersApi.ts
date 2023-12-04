import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import BaseApi from 'sdk/reduxBase/baseApi';
import { ActionTypes, sliceName } from './usersConfig';
import * as selectors from './usersSelector';
import FirebaseRefrenceApi from '../firebase/firebaseApi';
import { AUTHENTICATED_OSS_TABLE } from 'consts/firebase';
import { User } from 'interfaces/User';
import { FAILURE, SUCCESS } from 'sdk/common/responses/constants';
import LoginApi from '../login/loginApi';
import { ALL_HEB } from 'consts';

export default class UsersApi extends BaseApi {
	constructor(store: ToolkitStore) {
		super(store, ActionTypes, sliceName);
		this.firebaseApi = FirebaseRefrenceApi.instance;
		this.loginApi = new LoginApi(store);
	}
	
	getUsers() {
		return selectors.usersSelector(this.store.getState());
	}

	registerUsers = () => {
		return this.firebaseApi.registerCall(AUTHENTICATED_OSS_TABLE, (snapshot) => {
			const result = snapshot.val();
			Object.keys(snapshot.val()).forEach((key) => {
				const user: User = result[key];
				if (user.handleCity !== ALL_HEB) {
					this.firebaseApi.asyncUpdate(`${AUTHENTICATED_OSS_TABLE}/${key}`, { handleCity: 'all' });
				}
			});
			this.updateUsers(result);
		});
	};
	updateUsers = (users: string) => {
		this.store.dispatch({ type: ActionTypes.UPDATE_USERS, payload: users });
		return this.sdkResponser.success();
	};

	updateUserInFB = async (userId: string, user: User) => {
		const updatorUID = window.localStorage.getItem('fbUID');
		// eslint-disable-next-line no-param-reassign
		user.handleCity = ALL_HEB;
		try {
			await this.firebaseApi.asyncUpdate(`${AUTHENTICATED_OSS_TABLE}/${userId}`, {
				...user,
				userLastUpdateDate: new Date(),
				userLastUpdateBy: updatorUID
			});
		} catch (err) {
			// eslint-disable-next-line no-console
			console.warn(err);
			return FAILURE;
		}
		return SUCCESS;
	};

	firebaseApi: FirebaseRefrenceApi;
	loginApi: LoginApi;
}

