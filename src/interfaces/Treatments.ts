export type Treatment = {
	treatmentId?: string;
	date?: string;
	rowType?: string;
	contactPerson?: string;
	summary?: string;
	suggestedSolutions?: string;
	rate?: Rate;
	treatmentContinuous?: string;
	youthId?: string;
	class?: string;
	worry?: Worry;
	diffContact?: string;
};
export type Rate = '1' | '2' | '3' | '4' | '5' |'6';

export type Worry = '0' | '1' | '2' | '3' | '4' | '5' |'6';

export type Roll = 'Teacher' | 'Admin' | 'Guide' | 'SchoolCounselor' | 'Wellfare';
