import { School } from 'sdk/modules/globalConfig/globalConfigInterface';
import { User } from './User';

export interface AddNewUserForm extends User {
	name: string;
	phoneNumber: string;
	roll?: string;
	email: string;
	isTeacher?: boolean;
	isAdmin?: boolean;
	isCounselor?: boolean;
	isGuide?: boolean;
	school?: School;
}
