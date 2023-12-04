import { User } from 'interfaces/User';
import { APIError } from 'sdk/interfaces/sdkInterface';

export interface UsersState {
	users: Record<string, User> | {};
	error?: APIError;
}
