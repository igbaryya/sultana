import { EMPTY_STRING } from 'consts';

export type Youth = Record<string, YouthDetails>;

export type YouthDetails = {
	id: string;
	dateOfBirth?: string;
	age?: string;
	city?: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	gender: Gender;
	parents: Parents[];
	hotel: {
		name: string;
		address?: string;
	};
	languages: string[];
	disconnected?: boolean;
	school?: string;
	class?: string;
	classNumber?: number | string;
	dateOfbirth?: number | Date | string;
	previousTreatmentHistory: PreviousTreatmentHistory;
	lastAvailablityAtZoom?: number | Date | string;
	lastAvailabilityAtVenture?: number | Date | string;
	riskCharacteristics: RiskCharacteristics;
	lastWorry?: number | string;
	continueTreatmentHosen?: boolean;
	continueTreatmentShapach?: boolean;
	continueTreatmentEmotionalTherapy?: boolean;
	responsibleInstructor?: string;
	summary?: string;
	notes?: string;
	attendance?: string;
	returnedToStudy?: boolean;
	teacherName?: string;
	counselorName?: string;
	referrer?: string;
};

export type HotelCSV = {
	name: string;
	address?: string;
};

export type YouthCSV = {
	id: string;
	firstName: string;
	lastName: string;
	dateOfBirth?: string;
	dateOfbirth: string;
	phoneNumber: string;
	gender: string;
	hotel: string;
	hotelAddress: string;
	school: string;
	class: string;
	classNumber: string | number;
	languages: string;
	parentName1: string;
	parentPhoneNumber1: string;
	parentName2: string;
	city: string;
	parentPhoneNumber2: string;
	lastAvailablityAtZoom: string;
	lastAvailabilityAtVenture: string;
	lastWorry: string | number;
	notes: string;
};
export type RiskCharacteristics = {
	drugs: TypeOfRisks;
	violenceInFamily: TypeOfRisks;
	involvedInViolentIncident: TypeOfRisks;
	securityAnxieties: TypeOfRisks;
	/*victimOfSexualViolence: TypeOfRisks,
		sexualViolence: TypeOfRisks,
		violence: TypeOfRisks,
		victimOfViolence: TypeOfRisks,*/
	alcohol: TypeOfRisks;
	mental: TypeOfRisks;
	suicide: TypeOfRisks;
	socialAnxieties: TypeOfRisks;
	criminalInvolvementRisk: TypeOfRisks;
	selfHarm: TypeOfRisks;
	seclusion: TypeOfRisks;
	eatingDisorders: TypeOfRisks;
};
export type KeyOf<T> = keyof T;
export type Parents = {
	name: string;
	phoneNumber: string;
};

export type Gender = 'M' | 'F';

export type ReturnedToStudy = 'Y' | 'N' | 'ALL';

export type Age = '12' | '13'| '14'| '15'| '16'| '17'| '18';

export type Class = '1'| '2'| '3'| '4'| '5'| '6'| '7'| '7m'| '7a'| '8'| '8m'| '8a'| '9'| '10'| '11'| '12';

export type PreviousTreatmentHistory = {
	welfare?: string;
	advisory?: string;
	educationalPsychologist?: string;
	criminalInvolvement?: string;
};

export type TypeOfRisks = 'No'| 'Yes';

export const EMPTY_YOUTH: YouthDetails = {
	dateOfBirth: EMPTY_STRING,
	firstName: EMPTY_STRING,
	gender: 'M',
	hotel: {
		name: EMPTY_STRING,
		address: EMPTY_STRING
	},
	id: EMPTY_STRING,
	languages: [],
	lastName: EMPTY_STRING,
	parents: [
		{
			name: EMPTY_STRING,
			phoneNumber: EMPTY_STRING
		},
		{
			name: EMPTY_STRING,
			phoneNumber: EMPTY_STRING
		}
	],
	phoneNumber: EMPTY_STRING,
	previousTreatmentHistory: {
		advisory: EMPTY_STRING,
		criminalInvolvement: EMPTY_STRING,
		educationalPsychologist: EMPTY_STRING,
		welfare: EMPTY_STRING
	},
	riskCharacteristics: {
		drugs: 'No',
		violenceInFamily: 'No',
		involvedInViolentIncident: 'No',
		securityAnxieties: 'No',
		/*victimOfSexualViolence: 'No',
		sexualViolence: 'No',
		violence: 'No',
		victimOfViolence: 'No',*/
		alcohol: 'No',
		mental: 'No',
		suicide: 'No',
		socialAnxieties: 'No',
		criminalInvolvementRisk: 'No',
		selfHarm: 'No',
		seclusion: 'No',
		eatingDisorders: 'No'
	},
	class: EMPTY_STRING,
	classNumber: EMPTY_STRING,
	dateOfbirth: EMPTY_STRING,
	disconnected: false,
	lastAvailabilityAtVenture: EMPTY_STRING,
	lastAvailablityAtZoom: EMPTY_STRING,
	school: EMPTY_STRING
};
