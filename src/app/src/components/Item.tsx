type Props = {
	text: string;
	onClick: Function;
};

export const Item: Component<Props> = ({ text, onClick }) => {
	return (
		<p onClick={onClick} id={text}>
			{text}
		</p>
	);
};
