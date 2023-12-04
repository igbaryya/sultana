import { User } from 'interfaces/User';
import { APIError } from 'sdk/interfaces/sdkInterface';

export interface LoginState {
	currentUser: User | null;
	error?: APIError;
	sendSMS: boolean;
	isByGoogle?: boolean;
}
