import { Events } from './scripts/types/enums';
import Router from './scripts/router';
import './style.scss';

window.addEventListener(Events.hashchange, Router);
window.addEventListener(Events.load, Router);
