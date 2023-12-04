import { APIError } from 'sdk/interfaces/sdkInterface';

export interface GlobalConfigState {
	baseUrl: BaseUrl;
	error?: APIError;
	auth?: string;
	isSpinnerVisible?: boolean;
	hotels: Hotel[];
	schools: School[];
}
export type Hotel = {
	name: string;
	address?: string;
};
export type School = {
	name: string;
	address?: string;
};
export type BaseUrl = {
	host: string;
	port: string;
	protocol: string | number;
	graphqlUrl: string;
	isTestingEndpoint?: boolean;
};

