export const delay = (time: number): Promise<null> => new Promise((resolve) => setTimeout(resolve, time, null));

export const timeout = <T>(time: number, compute: () => T): Promise<T | null> => {
	const computePromise = new Promise<T>((resolve) => {
		const result = compute();

		resolve(result);
	});

	const timeoutPromise = delay(time);

	return Promise.race([timeoutPromise, computePromise]);
};
