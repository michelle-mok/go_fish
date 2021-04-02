/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// get a random index from an array given it's size
const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  // create the empty deck at the beginning
  const deck = [];

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    let rankCounter = 1;
    while (rankCounter <= 13) {
      let cardName = rankCounter;

      // 1, 11, 12 ,13
      if (cardName === 1) {
        cardName = 'ace';
      } else if (cardName === 11) {
        cardName = 'jack';
      } else if (cardName === 12) {
        cardName = 'queen';
      } else if (cardName === 13) {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};

// helper function for finding books
const findBooks = (playerHand) => {
  const winningBooks = [];

  if (playerHand.length > 3) {
    for (let i = 0; i < playerHand.length - 3; i += 1) {
      if (playerHand[i].rank === playerHand[i + 3].rank) {
        const book = playerHand.splice(i, i + 4);
        console.log('book', book);
        console.log('player 1 hand', playerHand);
        winningBooks.push(book);
        console.log('winning books:', winningBooks);
      }
    }
    return { playerHand, winningBooks };
  }
  return { playerHand };
};

// helper function that gets distinct ranks of cards in player's hand
const getDistinctNames = (playerHand) => {
  const cardNames = [];
  for (let i = 0; i < playerHand.length; i += 1) {
    const cardName = playerHand[i].name;
    cardNames.push(cardName);
  }
  console.log('cardNames:', cardNames);
  const distinctCardNames = [...new Set(cardNames)];
  console.log('distinct Names:', distinctCardNames);

  return distinctCardNames;
};
/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *  */

export default function initGamesController(db) {
  // create new game
  const create = async (req, res) => {
    // deck which cards will be drawn from
    const cardDeck = shuffleCards(makeDeck());

    // player 1's cards
    const player1Hand = [];
    for (let i = 0; i < 7; i += 1) {
      const playerCard = cardDeck.pop();
      player1Hand.push(playerCard);
    }

    player1Hand.sort((a, b) => a.rank - b.rank);
    console.log('sorrted player 1 hand:', player1Hand);

    // check to see if there are any books, return altered array if there is one, plus winning books
    const player1cards = findBooks(player1Hand);
    console.log(player1cards);

    // get card names for card request buttons
    const player1names = getDistinctNames(player1Hand);
    console.log(player1names);

    // player 2's cards
    const player2Hand = [];
    for (let i = 0; i < 7; i += 1) {
      const playerCard = cardDeck.pop();
      player2Hand.push(playerCard);
    }

    player2Hand.sort((a, b) => a.rank - b.rank);
    console.log('sorrted player 2 hand:', player2Hand);

    const player2cards = findBooks(player2Hand);
    console.log(player2cards);

    const player2names = getDistinctNames(player2Hand);
    console.log(player2names);

    try {
      // make entry into games table in database
      const newGame = await db.Game.create({
        gameState: {
          status: 'active',
          cardDeck,
          player1cards,
          player2cards,
          player1names,
          player2names,
          score: {
            player1: 0,
            player2: 0,
          },
        },
      });
      console.log('game created: ', newGame);

      // add players to join table game_users

      // first player is player who initialises game
      console.log('player user id', req.cookies.userId);

      const player1 = await db.User.findByPk(req.cookies.userId);
      console.log('player 1', player1);
      console.log('player 1 id:', player1.id);

      // TODO: change player 2 after testing
      // second player is chosen at random from players whose availability is true
      // const secondPlayerArray = await db.User.findAll({
      //   where: {
      //     availability: 'true',
      //   },
      // });
      // console.log('second player array: ', secondPlayerArray);
      // const randNum = Math.floor(Math.random() * secondPlayerArray.length);
      // const player2 = secondPlayerArray[randNum];

      const player2 = await db.User.findByPk(2);
      console.log('player 2', player2);

      // add both players to the game_users table
      const joinTableEntry = await newGame.addUser(player1);
      console.log('player1 game users table', joinTableEntry);

      const joinTableEntry2 = await newGame.addUser(player2);
      console.log('player2 game users table', joinTableEntry2);

      if (req.cookies.userId === player1.id) {
        res.send({
          id: newGame.id,
          playerId: player1.id,
          playerCards: newGame.gameState.player1cards,
          playerNames: newGame.gameState.player1names,
          score: newGame.gameState.score,
          status: newGame.gameState.status,
        });
      } else {
        res.send({
          id: newGame.id,
          playerId: player2.id,
          playerCards: newGame.gameState.player2cards,
          playerNames: newGame.gameState.player2names,
          score: newGame.gameState.score,
          status: newGame.gameState.status,
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  return { create };
}
