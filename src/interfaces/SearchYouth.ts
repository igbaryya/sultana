import { Gender } from './YouthObject';

export type SearchYouthForm = {
	id?: string;
	firstName?: string;
	lastName?: string;
	hotel?: string;
	gender?: 'ALL' | Gender;
	date?: string;
	city?: string | Record<string, boolean>;
	dateEnd?: string;
	lastWorryStart?: string;
	lastWorryEnd?: string;
	age?: string;
	responsibleInstructor?: string;
	school?: string;
	class?: string;
	phoneNumber?: string;
	referrer?: string;
	returnedToStudy?: string;
};
