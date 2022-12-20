import PHTML from '@v8tenko/phtml';
import './reset.css';

import { Counter } from './src/components/Todo';

const root = document.getElementById('root');

PHTML.DOM.render(root!, Counter);
