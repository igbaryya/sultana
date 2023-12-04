/* eslint-disable no-console */
export class Logger {
	static log(title: string, msg?: string, type?: 'info' | 'error' | 'warn') {
		console[type || 'info'](title, msg);
	}
}
