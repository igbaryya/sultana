export interface CallOptions {
	skipSpinner?: boolean;
	skipError?: boolean;
}
export interface GrapqlData {
	operationName?: string;
	query: string;
	variables?: Record<string, string> | {};
}
