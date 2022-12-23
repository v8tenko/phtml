export const Item: Component<{ text: string; onClick: Function }> = ({ text, onClick }) => {
	return <p onClick={onClick}>{text}</p>;
};
