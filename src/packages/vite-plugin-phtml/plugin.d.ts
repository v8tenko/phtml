export declare const phtmlPlugin: () => {
	name: string;
	transform(code: string, filename: string): string | null | undefined;
};
