type Props = {
	onClick: Function;
};

export const Item: PHTML.Component<Props> = ({ children, onClick }) => {
	return <p onClick={onClick}>{children}</p>;
};
