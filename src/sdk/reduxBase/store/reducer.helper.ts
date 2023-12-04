import constants from './reducer.constans';

/**
 * @param {Object} arg1 | Full Store
 * @param {Array} arg2  | Whitelist
 * @param {Object} arg3 | Current State 
 * 
 * @returns Empty Store.
 */
export type AppReducerOptions = {
	clearStateType?: string;
	whitelist?: never[];
	noOverride?: boolean;
};
const eraseStore = (arg1: any, arg2 = [], arg3: Record<string, any>) => {
	const clear = (obj: Record<string, any>, key: string) => {
		if (arg3[key] !== undefined) {
			// eslint-disable-next-line no-param-reassign
			obj[key] = arg3[key];
		}
		return obj;
	};
	const resultState = arg2.reduce(clear, arg1);
	return resultState;
};

const redueIt = (reducer: Function, options?: AppReducerOptions) => (state: any, action: Record<string, any>) => {
	const cleanActionType = !options?.clearStateType ? constants.BASE_ACTION_TYPES.CLEAR_STORE : options?.clearStateType;
	if (cleanActionType === action.type) {
		return eraseStore(reducer(undefined, action), options?.whitelist, state);
	}
	return reducer(state, action);
};

let reducers = {};
export const initReducers = (reducersMap: any, options?: AppReducerOptions) => {
	if (options?.noOverride) {
		reducers = { ...reducersMap, ...reducers };
	} else {
		reducers = { ...reducers, ...reducersMap };
	}
};

export default redueIt;
