import { useEffect, useState } from '@v8tenko/phtml';

type Props = {};

export const Item: PHTML.Component<Props> = ({ children }) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		console.log(`hello from ${children}`);

		return () => {
			console.log(`bye-bye ${children}`);
		};
	}, []);

	return (
		<p onClick={() => setCount((old) => old + 1)}>
			{children}/{count}
		</p>
	);
};
