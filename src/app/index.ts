import { pick } from '@v8tenko/utils';

const test = {
	name: 'test',
	lastname: 'voitenko'
};

const name = pick(test, ['name', 'lastname']);

console.log(name);
