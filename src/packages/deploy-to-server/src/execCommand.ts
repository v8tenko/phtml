import { Client, ClientChannel } from 'ssh2';

export const createPromiseConnection = (client: Client) => (command: string) =>
	new Promise<ClientChannel>((resolve, reject) => {
		client.exec(command, (err, channel) => {
			if (err) {
				reject(err);
			}

			resolve(channel);
		});
	});

export const awaitClientReady = (client: Client) =>
	new Promise<void>((resolve) => {
		client.on('ready', resolve);
	});
