import { useEffect, useMemo, useState } from '@v8tenko/phtml';

export const Calc: PHTML.Component = () => {
	const [count, setCount] = useState(-1);
	const doubleCount = useMemo(() => count * 2, [count]);

	useEffect(() => {
		console.log(`hello from calculator!`);

		return () => {
			console.log('bye-bye calculator');
		};
	}, []);

	return (
		<div>
			<p>{count}</p>
			<button onClick={() => setCount((old) => old + 1)}>inc</button>
			<button onClick={() => setCount((old) => old - 1)}>dec</button>
			<p>{doubleCount}</p>
		</div>
	);
};
