import { useState } from '@v8tenko/phtml';

import { Help } from './help';

export const Counter: Component = () => {
	const [count, setCount] = useState(0);

	return (
		<div className="counter">
			{count % 2 == 1 && <p>hello world from 1</p>}
			<button onClick={() => setCount(count + 1)}>+</button>
			{count && <Help />}
			<button onClick={() => setCount(count - 1)}>-</button>
			{count % 2 == 0 && <p>hello world from 0</p>}
			<p>{count}</p>
		</div>
	);
};
