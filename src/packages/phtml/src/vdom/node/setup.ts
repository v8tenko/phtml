if (!document) {
	const JSDOM = require('jsdom');

	const dom = new JSDOM();

	global.document = dom.window.document;
}

export {};
