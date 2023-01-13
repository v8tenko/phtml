import PHTML from '@v8tenko/phtml';
import './reset.css';

import { App } from './src/components/App';

const root = document.getElementById('root');

PHTML.DOM.render(root!, App);
