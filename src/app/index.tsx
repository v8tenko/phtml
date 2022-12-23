import PHTML from '@v8tenko/phtml';
import './reset.css';

import { DynamicList } from './src/components/DynamicList';

const root = document.getElementById('root');

PHTML.DOM.render(root!, DynamicList);
