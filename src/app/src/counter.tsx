import { useState } from '@v8tenko/phtml';

import { List } from './list';

export const Counter: Component = () => {
	const [count, setCount] = useState(0);

	return (
		<div className="counter">
			{count % 2 == 1 && <p>hello world from 1</p>}
			<button onClick={() => setCount(count + 1)}>+</button>
			<button onClick={() => setCount(count - 1)}>-</button>
			{count % 2 == 0 && <p>hello world from 0</p>}
			<p>{count}</p>
			<List />
		</div>
	);
};
