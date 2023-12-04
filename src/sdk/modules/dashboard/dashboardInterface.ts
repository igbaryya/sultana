import { KeyOf, RiskCharacteristics } from 'interfaces/YouthObject';
import { RiskFactorsState } from 'pages/summary/components/RiskFactorsFilter';
import { APIError } from 'sdk/interfaces/sdkInterface';

export type DashboardResultItem = {
	displayValue: string,
	key: string
	total: number
}
export type DashboardFilterResult = Record<string, DashboardResultItem[]>
export interface YouthData extends RiskCharacteristics {
	school: string,
	class: string
}
export interface DashboardState {
	rows?: RiskFactorsState;
	cols?: RiskFactorsState;
	result?: DashboardFilterResult;
	error?: APIError;
	youthsData?: Record<string, YouthData>
	treatmentsData?: any;
	filterFactors: string
	filterBy: string;
	schoolFilterBy: string;
}

export type YouthKeys = KeyOf<RiskCharacteristics> | 'school' | 'class'