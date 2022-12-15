type Dependency = {
	from: string;
	version: string;
};

type Module = {
	name: string;
	path: string;
	private: boolean;
	version?: string;
	devDependencies?: {
		[name: string]: Dependency;
	};
	dependencies?: {
		[name: string]: Dependency;
	};
};
