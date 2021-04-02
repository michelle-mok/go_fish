export default function buildWelcome(main) {
  // create welcome div
  const welcome = document.createElement('div');
  welcome.classList.add('welcome');
  main.appendChild(welcome);
}
