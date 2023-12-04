import { Treatment } from 'interfaces/Treatments';
import { Presence } from 'interfaces/Presence';

import { APIError } from 'sdk/interfaces/sdkInterface';
import { Youth } from 'interfaces/YouthObject';

export interface YouthState {
	error?: APIError;
	selectedYouthId?: string;
	rateText: Record<string | number, string>;
	treatments?: Record<string, Treatment> | null;
	presence?: Record<string, Presence> | null;
	youths?: Youth;
	youthsTreatments?: Record<string, Treatment> | null;
}
