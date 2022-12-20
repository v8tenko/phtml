import PHTML from '@v8tenko/phtml';

import { Counter } from './src/counter';

const root = document.getElementById('root');

PHTML.DOM.render(root!, Counter);
