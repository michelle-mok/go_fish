import './styles.scss';
import buildLoginAndRegister from './loginRegister.js';
import buildDashboard from './dashboard.js';
import buildWelcome from './welcome.js';

const main = document.createElement('div');
document.body.appendChild(main);

buildLoginAndRegister(main);

buildDashboard(main);

buildWelcome(main);
