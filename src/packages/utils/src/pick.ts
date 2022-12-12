export const pick = <Obj extends object, Keys extends Array<keyof Obj>>(obj: Obj, keys: Keys) => {
	const result = {} as Pick<Obj, Keys[number]>;

	for (const key of keys) {
		if (key in obj) {
			console.log('FOUND, WORKS???');
			result[key] = obj[key];
		}
	}

	return result;
};
