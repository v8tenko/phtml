import { useState } from '@v8tenko/phtml';

import './styles.css';
import { TodoCard } from './TodoCard';

export const Counter: Component = () => {
	const [todo, setTodo] = useState<string[]>([]);
	const [text, setText] = useState('');

	const addTodo = () => {
		if (!text) {
			return;
		}
		setTodo([...todo, text]);
		setText('');
	};

	const removeTodo = (content: string) => {
		setTodo(todo.filter((el) => el !== content));
	};

	return (
		<div className="app">
			<div className="todo-list">
				<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Input todo" />
				<button onClick={addTodo}> addTodo </button>
				{todo.length ? (
					todo.map((el) => <TodoCard text={el} removeTodo={() => removeTodo(el)} />)
				) : (
					<p className="hint">Empty. Add your first to-do</p>
				)}
			</div>
		</div>
	);
};
