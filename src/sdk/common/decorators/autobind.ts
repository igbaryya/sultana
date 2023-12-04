export function autobind(...args: any[]) {
	const fn = args[2].value;
	if (typeof fn !== 'function') {
		throw new Error(`@autobind decorator can only be applied to methods, not ${typeof fn}`);
	}
  
	return {
		configurable: true,
		get() {
			const boundFn = fn.bind(this);
			Object.defineProperty(this, args[1], {
				value: boundFn,
				configurable: true,
				writable: true
			});
			return boundFn;
		}
	};
}
