import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { GlobalConfigState } from 'sdk/modules/globalConfig/globalConfigInterface';
import { FirebaseState } from 'sdk/modules/firebase/firebaseInterface';
import { LoginState } from 'sdk/modules/login/loginInterface';
import { YouthState } from 'sdk/modules/youth/youthInterface';
import { UsersState } from 'sdk/modules/users/usersInterface';
import { DashboardState } from 'sdk/modules/dashboard/dashboardInterface';
// {GENERATOR_LINE_IMPORT}
import GlobalConfigApi from 'sdk/modules/globalConfig/globalConfigApi';
import FirebaseApi from 'sdk/modules/firebase/firebaseApi';
import LoginApi from 'sdk/modules/login/loginApi';
import YouthApi from 'sdk/modules/youth/youthApi';
import UsersApi from 'sdk/modules/users/usersApi';
import DashboardApi from 'sdk/modules/dashboard/dashboardApi';
// {GENERATOR_API_LINE_IMPORT}

export interface ReduxStoreOptions {
	store?: ToolkitStore;
}

export interface ApplicationSDKState {
	globalConfigApi: GlobalConfigState;
	firebaseApi: FirebaseState;
	loginApi: LoginState;
	youthApi: YouthState;
	usersApi: UsersState;
	dashboardApi: DashboardState;
	// {GENERATOR_LINE_EXPORT}
}

export interface ApplicationInstances {
	globalConfigApi: GlobalConfigApi;
	firebaseApi: FirebaseApi;
	loginApi: LoginApi;
	youthApi: YouthApi;
	usersApi: UsersApi;
	dashboardApi: DashboardApi;
	// {GENERATOR_API_LINE_EXPORT}
}

export interface APIError {
	errorCode: string;
	description?: string;
}
