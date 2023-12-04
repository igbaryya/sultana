import { APIError } from 'sdk/interfaces/sdkInterface';

export interface FirebaseState {
	helloWorldMsg: string;
	error?: APIError;
}
