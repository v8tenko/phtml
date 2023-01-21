import { useEffect, useState } from '@v8tenko/phtml';

import { Calc } from './Calc';
import { Item } from './Item';

export const App: PHTML.Component = () => {
	const [count, setCount] = useState(1);
	const [test, setTest] = useState(0);

	useEffect(() => {
		console.log('help');
	}, []);

	return (
		<>
			<p>count: {count}</p>
			<button onClick={() => setCount((old) => old + 1)}>inc</button>
			<button onClick={() => setCount((old) => old - 1)}>dec</button>
			{new Array(count).fill(0).map((_, i) => {
				return <Calc key={i} />;
			})}
			{count % 2 === 0 && <Item>test if</Item>}
			<button onClick={() => setTest((old) => old + 1)}>{test}</button>
		</>
	);
};
