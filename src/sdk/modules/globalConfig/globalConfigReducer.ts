import { PayloadAction } from '@reduxjs/toolkit';
import { ActionTypes } from './globalConfigConfig';
import { GlobalConfigState } from './globalConfigInterface';

const initialState: GlobalConfigState = {
	baseUrl: {
		graphqlUrl: 'http://localhost:4001/graphql',
		protocol: 'http',
		port: '4001',
		host: 'localhost',
		isTestingEndpoint: true
	},
	isSpinnerVisible: false,
	hotels: [],
	schools: []
};
const reducer = (state: GlobalConfigState, action: PayloadAction<any>): GlobalConfigState => {
	const { type, payload } = action;
	switch (type) {
		case ActionTypes.UPDATE_BASE_URL:
			return {
				...state,
				error: undefined,
				baseUrl: payload
			};
		case ActionTypes.CLEAR_API_ERROR:
			return {
				...state,
				error: undefined
			};
		case ActionTypes.UPDATE_API_ERROR:
			return {
				...state,
				error: payload
			};
		case ActionTypes.SET_SPINNER_VISIBILITY:
			return {
				...state,
				isSpinnerVisible: !!payload
			};
		case ActionTypes.UPDATE_SESSION_AUTH:
			return {
				...state,
				auth: payload
			};
		case ActionTypes.UPDATE_HOTELS:
			return {
				...state,
				hotels: payload
			};
		case ActionTypes.UPDATE_SCHOOLS:
			return {
				...state,
				schools: payload
			};
		default:
			return { ...initialState, ...state };
	}
};

export default reducer;
