import { spawn } from 'child_process';

export const runCommandAsPromise = (command: string, args: string[] = []): Promise<string> =>
	new Promise((resolve, reject) => {
		const process = spawn(command, args);
		const status = {
			log: '',
			error: ''
		};

		process.stdout.on('data', (data) => {
			const parsedOutput = data.toString();

			status.log += parsedOutput;
		});

		process.stderr.on('data', (error) => {
			const parsedError = error.toString();

			status.error += parsedError;
		});

		process.on('exit', () => {
			const { log, error } = status;

			if (error) {
				reject(new Error(error));
			}

			resolve(log);
		});
	});
