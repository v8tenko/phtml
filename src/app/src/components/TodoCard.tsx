type Props = {
	text: string;
	removeTodo(): void;
};

export const TodoCard: Component<Props> = ({ text, removeTodo }) => {
	return (
		<div className="todo-card">
			<p className="todo-card-text">{text}</p>
			<p className="todo-card-delete" onClick={removeTodo}>
				Delete
			</p>
		</div>
	);
};
