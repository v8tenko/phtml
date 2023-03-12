/* eslint-disable no-console */

type Props = {
	init: number;
};

export const Calc: PHTML.FC<Props> = ({ init }) => {
	return (
		<div>
			<p>{0}</p>
			<button onClick={() => console.log('+')}>inc</button>
			<button onClick={() => console.log('-')}>dec</button>
			<p>{init}</p>
		</div>
	);
};
