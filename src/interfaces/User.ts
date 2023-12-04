import { School } from 'sdk/modules/globalConfig/globalConfigInterface';

export type User = {
	name: string;
	lastAuthDate?: string;
	currentAuthDate?: string;
	phoneNumber: string;
	email: string;
	isAdmin?: boolean;
	isGuide?: boolean;
	isCounselor?: boolean;
	isWellfare?: boolean;
	school?: School;
	isTeacher?: boolean;
	handleCity?: string;
	userLastUpdateDate?: string;
	userLastUpdateBy?: string;
	isHidden?: boolean;
};
