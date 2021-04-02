import './styles.scss';
import buildLoginAndRegister from './loginRegister.js';
import buildDashboard from './dashboard.js';
import buildGameplay from './gameplay.js';
import buildWelcome from './welcome';

const main = document.createElement('div');
document.body.appendChild(main);

buildLoginAndRegister(main);

buildDashboard(main);

buildWelcome(main);
