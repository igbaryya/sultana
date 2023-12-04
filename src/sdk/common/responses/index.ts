import { FAILURE, SUCCESS } from './constants';

export const API_RESPONSES = {
	success: {
		status: SUCCESS
	},
	failure: (reason: string, description?: string) => {
		return {
			status: FAILURE,
			reason,
			description
		};
	},
	isSuccess: (status?: string) => {
		return SUCCESS.toLowerCase() === `${status}`.toLowerCase();
	}
};

export default class SDKResponser {
	constructor(errDispatcher: (a?: string, b?: string,) => void, sliceName: string) {
		this.errorDispatcher = errDispatcher;
		this.sliceName = sliceName;
	}
	
	success() {
		return API_RESPONSES.success;
	}

	error(reason: string, description?: string) {
		const errorObj = API_RESPONSES.failure(reason, description);
		this.errorDispatcher?.(reason, description);
		return errorObj;
	}
	sliceName: string;
	errorDispatcher?: ((msg?: string, description?: string) => void);
}
