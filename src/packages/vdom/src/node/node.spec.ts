import { createVNode } from './node';

describe('node', () => {
	it('should create a VNode', () => {
		const node = createVNode('p', { className: 'test' });

		expect(node).toEqual({
			tagName: 'p',
			props: { className: 'test' },
			children: undefined
		});
	});

	it('should create children', () => {
		const node = createVNode(
			'p',
			{ className: 'test' },
			createVNode('p', { className: 'test1' }),
			createVNode('p', { className: 'test2' })
		);

		expect(node).toEqual({
			tagName: 'p',
			props: { className: 'test' },
			children: [
				{
					tagName: 'p',
					props: { className: 'test1' }
				},
				{
					tagName: 'p',
					props: { className: 'test2' }
				}
			]
		});
	});
});
