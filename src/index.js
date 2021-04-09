import './styles.scss';
import axios from 'axios';
import * as login from './loginRegister.js';
import * as gameplay from './gameplay.js';
import buildDashboard from './dashboard.js';
import buildWelcome from './welcome.js';
import buildGameplay from './gameplay.js';

// declare current game variable
let currentGame;

// create main container where all the page elements will be appended
const main = document.createElement('div');
document.body.appendChild(main);

// create login/ register div
const loginRegisterDiv = document.createElement('div');
loginRegisterDiv.classList.add('login-register');
main.appendChild(loginRegisterDiv);

// create elements that will go in login/ register div
login.buildLoginAndRegister(main, loginRegisterDiv);

login.buildLoginModal(main, loginRegisterDiv);

buildDashboard(main);

buildWelcome(main);

// check if user is already logged in, if so, display the game that was in progress, if
axios
  .get('/already-logged-in')
  .then((response) => {
    console.log('response.data: ', response.data);

    if (response.data.user) {
      response.data.first_name = response.data.user.first_name;
      // if only user's data is sent back in the response,
      // there is no current game data, and a new game is created
      const newGame = login.buildPostLoginElements(loginRegisterDiv, response);
      newGame.addEventListener('click', () => {
        gameplay.createNewGame();
        document.querySelector('.welcome').remove();

        login.buildPostLoginElements(loginRegisterDiv, response);

        const buildgame = gameplay.buildGameplayElements(response.data.playerCards, main);
        console.log(buildgame);

        const requestButtonClick = gameplay.displayCardsAndInstructions(buildgame.cardsToDisplay, response, buildgame.playerCardsDiv, buildgame.displayMsgDiv);

        console.log('request button click', requestButtonClick);
      });
    } else if (response.data.playerCards) {
      console.log('response.data', response.data);
      // if there is current game data
      // removed welcome div to be replaced by gameplay div
      // gameplay elements are displayed
      document.querySelector('.welcome').remove();

      login.buildPostLoginElements(loginRegisterDiv, response);

      const buildgame = gameplay.buildGameplayElements(response.data.playerCards, main);
      console.log(buildgame.cardsToDisplay);

      const requestButtonClick = gameplay.displayCardsAndInstructions(buildgame.cardsToDisplay, response, buildgame.playerCardsDiv, buildgame.displayMsgDiv);

      console.log('request button click', requestButtonClick);

      // array containing names of player's cards only sent if user is current player
      if (response.data.playerNames) {
        gameplay.displayRequestButtons(response, buildgame.requestButtonsDiv, requestButtonClick.displayMsgDiv, requestButtonClick.playerTurnDiv, requestButtonClick.playerCardsDiv);
      } else {
        // checking if the current player has changed
        const checkPlayerRef = setInterval(() => {
          console.log('interval set');
          // checks to see if it's player's turn
          axios
            .post('/refresh', {
              gameId: response.data.id,
            })
            .then((response2) => {
              console.log('response 2', response2.data);
              // player names is array of cards that this player can request from opposing player
              // current player is changed over, request buttons are displayed
              if (response2.data.playerNames) {
                clearInterval(checkPlayerRef);

                gameplay.displayRequestButtons(response2, buildgame.requestButtonsDiv, requestButtonClick.displayMsgDiv, requestButtonClick.playerTurnDiv, requestButtonClick.playerCardsDiv);
              } else {
                console.log(response2);
              }
            });
        }, 3000);
      }
    } else {
      console.log('user is not logged in');
    }
  })
  .catch((error) => console.log(error));
