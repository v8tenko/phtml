import { execSync } from 'child_process';

export const getBuildInfo = async () => {
	const branch = execSync('git rev-parse --abbrev-ref HEAD')
		.toString('utf8')
		.replace(/[\n\r\s]+$/, '');

	return {
		branch
	};
};
