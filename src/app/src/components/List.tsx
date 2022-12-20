export const List: Component = () => {
	const array = new Array(3).fill(0).map((_, i) => i);

	return (
		<div>
			{array.map((value) => {
				return <p>hello from {value}</p>;
			})}
		</div>
	);
};
