import PHTML from '@v8tenko/phtml';
import './reset.css';

import { TodoList } from './src/components/TodoList';

const root = document.getElementById('root');

PHTML.DOM.render(root!, TodoList);
