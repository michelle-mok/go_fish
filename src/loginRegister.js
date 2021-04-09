import axios from 'axios';
import buildGameplay, { createNewGame } from './gameplay.js';

// create log in/ sign up div
export const buildLoginAndRegister = (main, loginRegisterDiv) => {
  // const loginRegisterDiv = document.createElement('div');
  // loginRegisterDiv.classList.add('login-register');
  // main.appendChild(loginRegisterDiv);

  // create log in and sign up links
  const loginDiv = document.createElement('div');
  loginDiv.classList.add('login');
  loginDiv.setAttribute('id', 'login');
  loginDiv.textContent = 'Log In';
  loginRegisterDiv.appendChild(loginDiv);

  const registerDiv = document.createElement('div');
  registerDiv.classList.add('register');
  registerDiv.textContent = 'Sign Up';
  loginRegisterDiv.appendChild(registerDiv);
};

// build elements tha appear post login or if user is already logged in
export const buildPostLoginElements = (loginRegisterDiv, response) => {
  if (document.querySelector('.login')) {
    document.querySelector('.login').remove();
    document.querySelector('.register').remove();
  }

  // create log out button
  const logoutDiv = document.createElement('div');
  logoutDiv.classList.add('logout');
  logoutDiv.textContent = 'Log Out';
  loginRegisterDiv.appendChild(logoutDiv);

  // display welcome message to user
  const welcomeMsgDiv = document.createElement('div');
  welcomeMsgDiv.classList.add('welcome-msg');
  welcomeMsgDiv.textContent = `Welcome back ${response.data.first_name}`;
  document.querySelector('.dashboard').appendChild(welcomeMsgDiv);

  // create a create game button div
  const createGameDiv = document.createElement('div');
  createGameDiv.classList.add('create-game');

  // create user statistics section in dashboard
  const statsDiv = document.createElement('div');
  statsDiv.classList.add('stats');
  statsDiv.innerHTML = 'Games played: <br>Win: <br> Lose: <br> Draw: <br>';
  createGameDiv.appendChild(statsDiv);

  // create a game button that will produce gameplay elements when clicked
  const createGameButton = document.createElement('button');
  createGameButton.classList.add('create-game-btn');
  createGameButton.textContent = 'Create Game';
  createGameDiv.appendChild(createGameButton);
  document.querySelector('.dashboard').appendChild(createGameDiv);
  return createGameButton;
};

// modal for login
export const buildLoginModal = (main, loginRegisterDiv) => {
  const modalDiv = document.createElement('div');
  modalDiv.setAttribute('id', 'modal');
  modalDiv.classList.add('modal');
  document.body.appendChild(modalDiv);

  const modalContentDiv = document.createElement('div');
  modalContentDiv.classList.add('modal-content');
  modalDiv.appendChild(modalContentDiv);

  const modalHeaderDiv = document.createElement('div');
  modalHeaderDiv.classList.add('modal-header');
  modalContentDiv.appendChild(modalHeaderDiv);

  const modalHeaderText = document.createElement('p');
  modalHeaderText.textContent = 'Log In';
  modalHeaderDiv.appendChild(modalHeaderText);

  const xclose = document.createElement('span');
  xclose.classList.add('closeBtn');
  xclose.innerHTML = '&times;';
  modalHeaderDiv.appendChild(xclose);

  const modalBodyDiv = document.createElement('div');
  modalBodyDiv.classList.add('modal-body');
  modalContentDiv.appendChild(modalBodyDiv);

  const emailInputDiv = document.createElement('div');

  const emailInputLabel = document.createElement('label');
  emailInputLabel.setAttribute('for', 'email');
  emailInputLabel.textContent = 'Email: ';
  emailInputDiv.appendChild(emailInputLabel);

  const emailInput = document.createElement('input');
  emailInput.setAttribute('id', 'email');
  emailInputDiv.appendChild(emailInput);

  modalBodyDiv.appendChild(emailInputDiv);

  const passwordInputDiv = document.createElement('div');

  const passwordInputLabel = document.createElement('label');
  passwordInputLabel.setAttribute('for', 'password');
  passwordInputLabel.textContent = 'password: ';
  passwordInputDiv.appendChild(passwordInputLabel);

  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('id', 'password');
  passwordInputDiv.appendChild(passwordInput);

  modalBodyDiv.appendChild(passwordInputDiv);

  const submitBtnDiv = document.createElement('div');
  submitBtnDiv.classList.add('submit-btn-div');
  modalContentDiv.appendChild(submitBtnDiv);

  const submitBtn = document.createElement('input');
  submitBtn.setAttribute('id', 'submit');
  submitBtn.setAttribute('type', 'submit');
  submitBtn.textContent = 'submit';
  submitBtnDiv.appendChild(submitBtn);

  const modal = document.getElementById('modal');

  const showForm = document.getElementById('login');

  const closeBtn = document.querySelector('.closeBtn');

  const submitForm = document.getElementById('submit');

  // display the modal when login div is clicked
  showForm.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // closes the modal when the x in the modal is clicked
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // submits user details for verification
  submitForm.addEventListener('click', () => {
    console.log(document.querySelector('#email').value);
    console.log(document.querySelector('#password').value);

    axios
      .post('/login', {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
      })
      .then((response) => {
        console.log(response.data);

        if (response.data.user) {
          const gameButton = buildPostLoginElements(loginRegisterDiv, response);

          gameButton.addEventListener('click', () => {
            document.querySelector('.welcome').remove();
            buildGameplay(main);
          });
        } else {
          // if login is unsuccessful
          const errorMsg = document.createElement('div');
          errorMsg.textContent = `${response.data.unsuccessfulLogin}`;
          loginRegisterDiv.appendChild(errorMsg);
        }
      })
      .catch((error) => console.log(error));

    modal.style.display = 'none';
  });
};

// export default function buildLoginAndRegister(main) {
// create log in/ sign up div
// const loginRegisterDiv = document.createElement('div');
// loginRegisterDiv.classList.add('login-register');
// main.appendChild(loginRegisterDiv);

// // create log in and sign up links
// const loginDiv = document.createElement('div');
// loginDiv.classList.add('login');
// loginDiv.setAttribute('id', 'login');
// loginDiv.textContent = 'Log In';
// loginRegisterDiv.appendChild(loginDiv);

// const registerDiv = document.createElement('div');
// registerDiv.classList.add('register');
// registerDiv.textContent = 'Sign Up';
// loginRegisterDiv.appendChild(registerDiv);

// modal for login
// const modalDiv = document.createElement('div');
// modalDiv.setAttribute('id', 'modal');
// modalDiv.classList.add('modal');
// document.body.appendChild(modalDiv);

// const modalContentDiv = document.createElement('div');
// modalContentDiv.classList.add('modal-content');
// modalDiv.appendChild(modalContentDiv);

// const modalHeaderDiv = document.createElement('div');
// modalHeaderDiv.classList.add('modal-header');
// modalContentDiv.appendChild(modalHeaderDiv);

// const modalHeaderText = document.createElement('p');
// modalHeaderText.textContent = 'Log In';
// modalHeaderDiv.appendChild(modalHeaderText);

// const xclose = document.createElement('span');
// xclose.classList.add('closeBtn');
// xclose.innerHTML = '&times;';
// modalHeaderDiv.appendChild(xclose);

// const modalBodyDiv = document.createElement('div');
// modalBodyDiv.classList.add('modal-body');
// modalContentDiv.appendChild(modalBodyDiv);

// const emailInputDiv = document.createElement('div');

// const emailInputLabel = document.createElement('label');
// emailInputLabel.setAttribute('for', 'email');
// emailInputLabel.textContent = 'Email: ';
// emailInputDiv.appendChild(emailInputLabel);

// const emailInput = document.createElement('input');
// emailInput.setAttribute('id', 'email');
// emailInputDiv.appendChild(emailInput);

// modalBodyDiv.appendChild(emailInputDiv);

// const passwordInputDiv = document.createElement('div');

// const passwordInputLabel = document.createElement('label');
// passwordInputLabel.setAttribute('for', 'password');
// passwordInputLabel.textContent = 'password: ';
// passwordInputDiv.appendChild(passwordInputLabel);

// const passwordInput = document.createElement('input');
// passwordInput.setAttribute('id', 'password');
// passwordInputDiv.appendChild(passwordInput);

// modalBodyDiv.appendChild(passwordInputDiv);

// const submitBtnDiv = document.createElement('div');
// submitBtnDiv.classList.add('submit-btn-div');
// modalContentDiv.appendChild(submitBtnDiv);

// const submitBtn = document.createElement('input');
// submitBtn.setAttribute('id', 'submit');
// submitBtn.setAttribute('type', 'submit');
// submitBtn.textContent = 'submit';
// submitBtnDiv.appendChild(submitBtn);

// const modal = document.getElementById('modal');

// const showForm = document.getElementById('login');

// const closeBtn = document.querySelector('.closeBtn');

// const submitForm = document.getElementById('submit');

// // display the modal when login div is clicked
// showForm.addEventListener('click', () => {
//   modal.style.display = 'block';
// });

// // closes the modal when the x in the modal is clicked
// closeBtn.addEventListener('click', () => {
//   modal.style.display = 'none';
// });

// // submits user details for verification
// submitForm.addEventListener('click', () => {
//   console.log(document.querySelector('#email').value);
//   console.log(document.querySelector('#password').value);

//   axios
//     .post('/login', {
//       email: document.querySelector('#email').value,
//       password: document.querySelector('#password').value,
//     })
//     .then((response) => {
//       console.log(response.data);

//       if (response.data.user) {
//         buildPostLoginElements();

//         createGameButton.addEventListener('click', () => {
//           document.querySelector('.welcome').remove();
//           buildGameplay(main);
//         });
//       } else {
//         // if login is unsuccessful
//         const errorMsg = document.createElement('div');
//         errorMsg.textContent = `${response.data.unsuccessfulLogin}`;
//         loginRegisterDiv.appendChild(errorMsg);
//       }
//     })
//     .catch((error) => console.log(error));

//   modal.style.display = 'none';

// }
