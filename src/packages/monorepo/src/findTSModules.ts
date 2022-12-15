import { execSync } from 'child_process';

export const findALlModules = async (): Promise<Module[]> => {
	const allDeps = JSON.parse(execSync('pnpm list -r -json').toString()) as Module[];

	return allDeps;
};

export const findTSModules = async (): Promise<Module[]> => {
	const allModules = await findALlModules();

	return allModules.filter((module) => {
		const allDependecies = { ...(module.dependencies || {}), ...(module.devDependencies || {}) };

		return 'typescript' in allDependecies;
	});
};

export const findModule = async (name: string): Promise<Module | undefined> => {
	const allModules = await findALlModules();

	return allModules.find((module) => module.name === name);
};
