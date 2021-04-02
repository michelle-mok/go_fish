import axios from 'axios';

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

      const cardsToDisplay = response.data.playerCards;
      console.log('cards to display:', cardsToDisplay);

      cardsToDisplay.playerHand.forEach((element) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = `${element.name} of ${element.suit}`;
        playerCardsDiv.appendChild(card);
      });

      const cardNames = response.data.playerNames;
      console.log(cardNames);
      cardNames.forEach((name) => {
        // create a request button for each distinct card name
        const requestButton = document.createElement('button');
        requestButton.classList.add('request-button');
        requestButton.textContent = `${name}`;
        requestButtonsDiv.appendChild(requestButton);
        requestButton.addEventListener('click', () => {
          // display the player's request
          const msgBubbleDiv = document.createElement('div');
          msgBubbleDiv.classList.add('msg-bubble-div');
          const msgBubble = document.createElement('div');
          msgBubble.classList.add('msg-bubble');
          msgBubble.textContent = `${name}s !`;
          msgBubbleDiv.appendChild(msgBubble);
          displayMsgDiv.appendChild(msgBubbleDiv);
        });
      });
    })
    .catch((error) => console.log(error));
}
