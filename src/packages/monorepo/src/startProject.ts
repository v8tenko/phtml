import { findModule } from './findTSModules';
import { startModule } from './startModule';

export const startProject = async (project: string | Module) => {
	const rootModel = typeof project === 'string' ? await findModule(project) : project;

	if (!rootModel) {
		return;
	}

	startModule(rootModel);
	Object.keys(rootModel.dependencies || {}).forEach(startProject);
	Object.keys(rootModel.devDependencies || {}).forEach(startProject);
};
