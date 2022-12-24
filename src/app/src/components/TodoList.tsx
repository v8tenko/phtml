import { useEffect, useState } from '@v8tenko/phtml';

export const TodoList: Component = () => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		setInterval(() => setCount((old) => old + 1), 2000);
	}, []);

	return (
		<div>
			<p>hello from i</p>
			<p>count {count}</p>
		</div>
	);
};
