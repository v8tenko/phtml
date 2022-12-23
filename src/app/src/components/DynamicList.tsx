import { useState } from '@v8tenko/phtml';

import { Item } from './Item';

export const DynamicList: Component = () => {
	const [count, setCount] = useState(0);
	const [arr, setArr] = useState<string[]>([]);

	const add = () => {
		setArr((old) => [...old, `hello from ${count}`]);
		setCount((old) => old + 1);
	};

	const remove = (id: string) => {
		setArr((old) => old.filter((el) => el !== id));
	};

	return (
		<div className="list" id="sample">
			<button id="inc" onClick={add}>
				increase
			</button>
			<p>{count}</p>
			{arr.map((el) => (
				<Item key={el} onClick={() => remove(el)} text={el} />
			))}
		</div>
	);
};
