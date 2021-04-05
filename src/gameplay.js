import axios from 'axios';

// declare current game variable
let currentGame;

export default function buildGameplay(main) {
// create gameplay div
  const gameplay = document.createElement('div');
  gameplay.classList.add('gameplay');
  main.appendChild(gameplay);

  // displays card requests and "pond"
  const displayMsgDiv = document.createElement('div');
  displayMsgDiv.classList.add('msg-display');
  gameplay.appendChild(displayMsgDiv);

  // displays books that the player has
  const booksDiv = document.createElement('div');
  booksDiv.classList.add('books-div');
  booksDiv.textContent = 'nothing here yet';
  gameplay.appendChild(booksDiv);

  // displays players current cards
  const playerCardsDiv = document.createElement('div');
  playerCardsDiv.classList.add('cards-div');
  gameplay.appendChild(playerCardsDiv);

  // displays card request buttons
  const requestButtonsDiv = document.createElement('div');
  requestButtonsDiv.classList.add('request-buttons');
  gameplay.appendChild(requestButtonsDiv);

  axios
    .get('/new-game')
    .then((response) => {
      console.log(response.data);

      currentGame = response.data.id;
      console.log('current game id:', currentGame);

      const cardsToDisplay = response.data.playerCards;
      console.log('cards to display:', cardsToDisplay);

      // display cards in player's hand
      cardsToDisplay.playerHand.forEach((element) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = `${element.name} of ${element.suit}`;
        playerCardsDiv.appendChild(card);
      });

      const playerTurnDiv = document.createElement('div');
      playerTurnDiv.classList.add('player-turn');
      playerTurnDiv.textContent = `${response.data.message}`;
      displayMsgDiv.appendChild(playerTurnDiv);

      // if player is current player, the request buttons are displayed
      if (response.data.playerNames) {
        const cardNames = response.data.playerNames;
        console.log(cardNames);
        for (let i = 0; i < cardNames.length; i += 1) {
        // create a request button for each distinct card name
          const requestButton = document.createElement('button');
          requestButton.classList.add('request-button');
          requestButton.setAttribute('value', `${cardNames[i]}`);
          requestButton.setAttribute('id', `requestBtn${i}`);

          requestButton.textContent = `${cardNames[i]}`;
          requestButtonsDiv.appendChild(requestButton);
          requestButton.addEventListener('click', () => {
          // display the player's request
            const msgBubbleDiv = document.createElement('div');
            msgBubbleDiv.classList.add('msg-bubble-div');
            const msgBubble = document.createElement('div');
            msgBubble.classList.add('msg-bubble');
            msgBubble.textContent = `${cardNames[i]}s !`;
            msgBubbleDiv.appendChild(msgBubble);
            displayMsgDiv.appendChild(msgBubbleDiv);

            console.log(document.getElementById(`requestBtn${i}`));
            console.log(document.getElementById(`requestBtn${i}`).value);
            console.log(response.data.id);

            // send player request to backend for processing
            axios
              .post('/card-request', {
                requestedName: document.getElementById(`requestBtn${i}`).value,
                currentGame: response.data.id,
              })
              .then((response1) => {
                console.log(response1.data);
                // remove current elements

                playerTurnDiv.textContent = '';
                requestButtonsDiv.innerHTML = '';
                playerCardsDiv.innerHTML = '';
                msgBubble.remove();

                const cardsToDisplay1 = response1.data.playerCards;
                console.log('player cards', response1.data.playerCards);
                // display cards in player's hand
                cardsToDisplay1.playerHand.forEach((element) => {
                  const card = document.createElement('div');
                  card.classList.add('card');
                  card.textContent = `${element.name} of ${element.suit}`;
                  playerCardsDiv.appendChild(card);

                  playerTurnDiv.textContent = `${response1.data.message}`;
                });
              })
              .catch((error) => console.log(error));
          });
        }
      } else {
        // if player is not current player, the request buttons are not displayed
        // const okButtonDiv = document.createElement('div');
        // okButtonDiv.classList.add('ok-button-div');
        // requestButtonsDiv.appendChild(okButtonDiv);
        // const okButton = document.createElement('button');
        // okButton.classList.add('ok-button');
        // okButton.textContent = 'OK';
        // okButtonDiv.appendChild(okButton);
        setTimeout(() => {
          axios
            .post('/refresh', {
              gameId: currentGame,
            })
            .then((response1) => {
              if (response1.data.playerNames) {
                const cardNames = response1.data.playerNames;
                console.log(cardNames);
                for (let i = 0; i < cardNames.length; i += 1) {
                  // create a request button for each distinct card name
                  const requestButton = document.createElement('button');
                  requestButton.classList.add('request-button');
                  requestButton.setAttribute('value', `${cardNames[i]}`);
                  requestButton.setAttribute('id', `requestBtn${i}`);

                  requestButton.textContent = `${cardNames[i]}`;
                  requestButtonsDiv.appendChild(requestButton);
                }
              } else {
                console.log(response.data);
              }
            });
        }, 10000);
      }
    })
    .catch((error) => console.log(error));
}
