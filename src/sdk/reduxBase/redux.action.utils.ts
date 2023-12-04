export const createActionTypes = (types: string[]) => {
	const replace = (a: Record<string, string>, b: string) => {
		const tmpA = a;
		tmpA[b] = b;
		return tmpA;
	};
	return types.reduce(replace, {});
};
