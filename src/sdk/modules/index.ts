import DashboardApi, { config as DashboardConfig, reducer as DashboardReducer } from './dashboard';
import FirebaseApi, { config as FirebaseConfig, reducer as FirebaseReducer } from './firebase';
import GlobalConfigApi, { config as GlobalConfigConfig, reducer as GlobalConfigReducer } from './globalConfig';
import LoginApi, { config as LoginConfig, reducer as LoginReducer } from './login';
import UsersApi, { config as UsersConfig, reducer as UsersReducer } from './users';
import YouthApi, { config as YouthConfig, reducer as YouthReducer } from './youth';

const modules = {
	[FirebaseConfig.sliceName]: {
		reducer: FirebaseReducer,
		class: FirebaseApi
	},
	[DashboardConfig.sliceName]: {
		reducer: DashboardReducer,
		class: DashboardApi
	},
	[GlobalConfigConfig.sliceName]: {
		reducer: GlobalConfigReducer,
		class: GlobalConfigApi
	},
	[LoginConfig.sliceName]: {
		reducer: LoginReducer,
		class: LoginApi
	},
	[UsersConfig.sliceName]: {
		reducer: UsersReducer,
		class: UsersApi
	},
	[YouthConfig.sliceName]: {
		reducer: YouthReducer,
		class: YouthApi
	}
};
export default modules;
