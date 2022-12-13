import colors from 'colors';

import { findModule } from './findTSModules';
import { startModule } from './startModule';

export const startProject = async (project: string | Module) => {
	const rootModel = typeof project === 'string' ? await findModule(project) : project;

	if (!rootModel) {
		console.log(colors.red(`Unable to start project: ${project} not found`));

		throw new Error(`Unable to start project: ${project} not found`);
	}

	startModule(rootModel);
	Object.keys(rootModel.dependencies || {}).forEach(startProject);
};
