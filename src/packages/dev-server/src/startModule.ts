import { exec, spawn } from 'child_process';
import colors from 'colors';
import process from 'process';

import { findTSModules } from './findTSModules';

const MODULES_STATUS: Record<string, boolean> = {};

const isModuleEnabled = (name: string): boolean => MODULES_STATUS[name] === true;
const enableModule = (name: string): boolean => (MODULES_STATUS[name] = true);

export const startModule = async (module: string | Module) => {
	const tsModules = await findTSModules();
	const notEmptyModules = tsModules.filter((module) => module.name);

	const { path, name } = typeof module === 'string' ? notEmptyModules.find(({ name }) => name === module)! : module;

	if (!path) {
		throw new Error(
			`Unable to find ${module} module. Found modules: ${notEmptyModules.map((module) => module.name)}`
		);
	}

	if (name.endsWith('app')) {
		return;
	}

	exec(`cd ${path}`, (err) => {
		if (err) {
			console.log(colors.red(`Error: unable to locate to: ${path}`));

			throw new Error(`Unable to locate to: ${path}`);
		}

		if (isModuleEnabled(name)) {
			return;
		}

		enableModule(name);

		console.log(colors.green(`Starting in build mode: ${name}...`));
		process.chdir(path);
		const tsCompiler = spawn('tsc', ['-w']);

		tsCompiler.stdout.on('data', (data) => {
			const parsed = (data.toString() as string).trim();

			if (parsed) {
				console.log(`${name}: ${parsed}`);
			}
		});
	});
};
