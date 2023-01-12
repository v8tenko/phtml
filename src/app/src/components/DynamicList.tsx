import { useState } from '@v8tenko/phtml';

import { Item } from './Item';

export const DynamicList: PHTML.Component = () => {
	const [count, setCount] = useState(4);
	const [arr, setArr] = useState<string[]>(['0', '1', '2', '3']);

	const add = () => {
		setArr((old) => [...old, `${count}`]);
		setCount((old) => old + 1);
	};

	const patch = (id: number) => {
		setArr((old) => {
			old[id] += 'help';

			return old;
		});
	};

	return (
		<>
			<button onClick={add}>increase</button>
			<p>count: {count}</p>
			{arr.map((el, i) => {
				if (i % 2 == count % 2) {
					return undefined;
				}

				return (
					<Item key={el} onClick={() => patch(i)}>
						{el}
					</Item>
				);
			})}
			<>
				<div>hello!!!</div>
			</>
			<p>hello x2!!!</p>
			<>
				{arr.map((el, i) => {
					if (i % 2 !== count % 2) {
						return undefined;
					}

					return (
						<Item key={el} onClick={() => patch(i)}>
							{el}
						</Item>
					);
				})}
			</>
		</>
	);
};
