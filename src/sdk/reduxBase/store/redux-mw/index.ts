import { compose, Middleware } from '@reduxjs/toolkit';

const createMW = () => {
	let middlewares: Middleware[] = [];

	const removeMW = (middleware: Middleware) => {
		const index = middlewares.findIndex((d: Middleware) => d === middleware);
		if (index === -1) {
			// eslint-disable-next-line no-console
			console.error('Middleware does not exist!', middleware);
			return;
		}
		middlewares = middlewares.filter((...args: any[]) => args[1] !== index);
	};

	const resetMW = () => {
		middlewares = [];
	};

	const addMW = (...newMD: Middleware[]) => {
		middlewares = [...middlewares, ...newMD];
	};

	const mwEnhancer: Middleware = (store) => (next) => (action) => {
		const chain = middlewares.map((middleware: Middleware) => middleware(store));
		const composed: any = compose(...chain)(next);
		return composed(action);
	};

	return {
		mwEnhancer,
		addMW,
		removeMW,
		resetMW
	};
};

export const {
	addMW,
	removeMW,
	resetMW,
	mwEnhancer
} = createMW();

export default mwEnhancer;

export {
	createMW
};
