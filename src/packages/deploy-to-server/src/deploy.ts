import colors from 'colors';
import * as dotenv from 'dotenv';
import { Client, ConnectConfig } from 'ssh2';

import { getBuildInfo } from './branch';
import { awaitClientReady, createPromiseConnection } from './execCommand';

dotenv.config({ path: `${__dirname}/../../../../../.env` });

export const deploy = async () => {
	const { branch } = await getBuildInfo();

	console.log(colors.green(`Build request for ${colors.cyan(branch)} branch started...`));

	const conn = new Client();

	const options = {
		host: process.env.HOST,
		port: Number(process.env.PORT),
		username: process.env.USERNAME,
		privateKey: process.env.PRIVATE_KEY,
		passphrase: process.env.PASS_PHRASE
	} satisfies ConnectConfig;

	conn.connect(options);

	await awaitClientReady(conn);

	const promiseConnection = createPromiseConnection(conn);

	await promiseConnection(`sh build.sh ${branch}`);

	console.log(colors.green('Build successfuly pushed'));

	conn.destroy();
};

// some time it will be fine
