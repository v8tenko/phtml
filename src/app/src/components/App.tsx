import { useState } from '@v8tenko/phtml';

export const App: PHTML.Component = () => {
	const [count, setCount] = useState(0);

	return (
		<div>
			<p>count: {count}</p>
			<button onClick={() => setCount((old) => old + 1)}>inc</button>
			<button onClick={() => setCount((old) => old - 1)}>dec</button>
		</div>
	);
};
