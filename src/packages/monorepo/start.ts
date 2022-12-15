import { startProject } from './src/startProject';

const [project] = process.argv.slice(2);

startProject(project);
