import { pick } from '@v8tenko/utils';

const test = {
	name: 'test',
	lastname: 'voitenko',
	check: 1
};

const name = pick(test, ['name', 'lastname', 'check']);

console.log(name);
