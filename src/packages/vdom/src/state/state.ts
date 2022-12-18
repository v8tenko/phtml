import { patchChanges } from '../render/mount';

export const createState = <T extends Object>(initial: T): T =>
	new Proxy(initial, {
		set(target, key, value) {
			target[key as keyof T] = value;
			patchChanges?.();

			return true;
		},
		get(target, key) {
			return target[key as keyof T];
		}
	});
