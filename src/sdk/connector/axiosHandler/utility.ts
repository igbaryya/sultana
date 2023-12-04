export const isSuccessStatusCode = (statusCode: string | number) => {
	return `${statusCode}`.startsWith('20');
};
