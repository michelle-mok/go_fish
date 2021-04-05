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
/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *  */
import Sequelize from 'sequelize';

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
    const cardName = playerHand[i].name.toString();
    cardNames.push(cardName);
  }
  console.log('cardNames:', cardNames);
  const distinctCardNames = [...new Set(cardNames)];
  console.log('distinct Names:', distinctCardNames);

  return distinctCardNames;
};

// check and update player hands after player request
const checkAndUpdateHands = (otherPlayerNames, requestedName, otherPlayer, currentPlayer) => {
  if (otherPlayerNames.includes(requestedName)) {
    for (let i = 0; i < otherPlayer.length; i += 1) {
    // if player 1's request matches player 2's cards
      if (otherPlayer[i].rank == requestedName) {
      // remove card from player 2's hand
        const requestedCard = otherPlayer.splice(i, 1);
        console.log('requested card', requestedCard);
        console.log('other player hand', otherPlayer);
        // add card to player 1's hand
        currentPlayer.push(requestedCard[0]);
        console.log('current player hand', currentPlayer);
      // keep track of the number of cards moved from player 1 to 2
      }
    }
  }
  return { otherPlayer, currentPlayer };
};
// import op from sequelize
const { Op } = Sequelize;

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
      console.log('player user id', req.cookies.userId);

      const player1 = await db.User.findByPk(req.cookies.userId);
      console.log('player1 ', player1);
      console.log('player1  id:', player1.id);

      // TODO: change player 2 after testing
      // second player is chosen at random from players whose availability is true
      const secondPlayerArray = await db.User.findAll({
        where: {
          availability: true,
          id: { [Op.ne]: Number(req.cookies.userId) },
        },
      });

      const randNum = Math.floor(Math.random() * secondPlayerArray.length);
      const player2 = secondPlayerArray[randNum];
      console.log('random number:', randNum);
      console.log('player 2', player2);

      // make entry into games table if player has not already added been added to a game
      const [currentGame, created] = await db.Game.findOrCreate({
        where: {
          [Op.and]: [{ gameState: { player2: Number(req.cookies.userId) } }, { gameState: { status: 'active' } }],
        },
        defaults: {
          gameState: {
            status: 'active',
            player1: Number(req.cookies.userId),
            player2: player2.id,
            currentPlayerId: Number(req.cookies.userId),
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
        },
      });
      console.log('game created/joined: ', currentGame);
      console.log('created', created);

      if (created) {
      // add both players to the game_users table
        const joinTableEntry = await currentGame.addUser(player1);
        console.log('player1 game users table', joinTableEntry);

        const joinTableEntry2 = await currentGame.addUser(player2);
        console.log('player2 game users table', joinTableEntry2);

        // change both players' availability to false
        await db.User.update({ availability: false }, {

          where: {
            [Op.or]: [{ id: player1.id }, { id: player2.id }],
          },
        });
      }

      if (Number(req.cookies.userId) === currentGame.gameState.currentPlayerId) {
        res.send({
          id: currentGame.id,
          playerId: player1.id,
          currentPlayerId: currentGame.gameState.currentPlayerId,
          playerCards: currentGame.gameState.player1cards,
          playerNames: currentGame.gameState.player1names,
          score: currentGame.gameState.score,
          status: currentGame.gameState.status,
          message: 'it\'s your turn, make a request',
        });
      } else {
        res.send({
          id: currentGame.id,
          playerId: currentGame.gameState.player2,
          currentPlayerId: currentGame.gameState.currentPlayerId,
          playerCards: currentGame.gameState.player2cards,
          score: currentGame.gameState.score,
          status: currentGame.gameState.status,
          message: 'it\'s the other player\'s turn, click ok to proceed',
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  // game logic for when a player requests cards from opponent
  const request = async (req, res) => {
    try {
      const { requestedName } = req.body;
      console.log('request body', req.body);
      // get game from database where id = current game id
      const currentGame = await db.Game.findOne({
        where: {
          id: req.body.currentGame,
        },
      });

      console.log('current game', currentGame);

      // get players' hands from current game
      const player2Hand = currentGame.gameState.player2cards.playerHand;
      const player1Hand = currentGame.gameState.player1cards.playerHand;
      console.log('player 2 hand:', player2Hand);

      // player 1's turn
      if (Number(req.cookies.userId) === currentGame.gameState.player1) {
        const player2CardNames = currentGame.gameState.player2names;
        console.log('player 2 card names:', player2CardNames);

        if (player2CardNames.includes(requestedName)) {
          for (let i = 0; i < player2Hand.length; i += 1) {
            // if player 1's request matches player 2's cards
            if (player2Hand[i].rank == requestedName) {
              // remove card from player 2's hand
              const requestedCard = player2Hand.splice(i, 1);
              console.log('requested card', requestedCard);
              console.log('player 2 hand', player2Hand);
              // add card to player 1's hand
              player1Hand.push(requestedCard[0]);
              console.log('player 1 hand', player1Hand);
            }
          }

          // sort updated player 1 hand
          player1Hand.sort((a, b) => a.rank - b.rank);
          console.log('sorrted player 1 hand:', player1Hand);
          // check if there are any books in player1's hand
          const player1cards = findBooks(player1Hand);
          // get distinct names from updated player1 hand
          const player1names = getDistinctNames(player1Hand);
          // get updated player2 cards
          const player2cards = findBooks(player2Hand);
          // get distinct names from updated player2's hand
          const player2names = getDistinctNames(player2Hand);

          // update game details in database
          const updatedGame = await currentGame.update({
            gameState: {
              status: 'active',
              player1: currentGame.gameState.player1,
              player2: currentGame.gameState.player2,
              currentPlayerId: currentGame.gameState.player1,
              cardDeck: currentGame.gameState.cardDeck,
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
          console.log('updated game', updatedGame);
          // send player 1 info to frontend
          res.send({
            id: updatedGame.id,
            playerId: currentGame.gameState.player1,
            player1cards: updatedGame.gameState.player1cards,
            player1names: updatedGame.gameState.player1names,
            message: 'it\'s still your turn, make another request',
          });
        } else {
          // get card from pool if player2 doesn't have requested name
          const cardFromPool = currentGame.gameState.cardDeck.pop();
          console.log('number of cards left:', currentGame.gameState.cardDeck.length);
          console.log('card from pool', cardFromPool);
          // add card from pool to player1's hand
          player1Hand.push(cardFromPool);
          console.log('card taken from pool', player1Hand);
          // check if there are any books in player1's hand
          const player1cards = findBooks(player1Hand);
          // get distinct names from updated player1 hand
          const player1names = getDistinctNames(player1Hand);
          // get updated player2 cards
          const player2cards = findBooks(player2Hand);
          // get distinct names from updated player2's hand
          const player2names = getDistinctNames(player2Hand);

          // if the name of the card matches the player1's request, still player1's turn
          if (cardFromPool.rank === requestedName) {
            const updatedGame = await currentGame.update({
              gameState: {
                status: 'active',
                player1: currentGame.gameState.player1,
                player2: currentGame.gameState.player2,
                currentPlayerId: currentGame.gameState.currentPlayerId,
                cardDeck: currentGame.gameState.cardDeck,
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

            // send player 1 info to frontend
            res.send({
              id: updatedGame.id,
              playerId: updatedGame.gameState.player1,
              player1cards: updatedGame.gameState.player1cards,
              player1names: updatedGame.gameState.player1names,
              message: 'it\'s still your turn, make another request',
            });
          } else {
            // if card from pool doesn't match player1's request,
            const updatedGame = await currentGame.update({
              gameState: {
                status: 'active',
                player1: currentGame.gameState.player1,
                player2: currentGame.gameState.player2,
                currentPlayerId: currentGame.gameState.player2,
                cardDeck: currentGame.gameState.cardDeck,
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
            // send message to frontend. player 1
            res.send({
              playerCards: player1cards,
              message: 'it is now player 2\'s turn',
            });
          }
        }
      } else {
        res.send('worked');
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const refresh = async (req, res) => {
    const { gameId } = req.body;

    try {
      const currentGame = await db.Game.findOne({
        where: {
          id: gameId,
        },
      });
      console.log('current game', currentGame);
      if (currentGame.gameState.currentPlayerId === Number(req.cookies.userId)) {
        res.send({
          id: currentGame.id,
          playerId: currentGame.gameState.player2,
          currentPlayerId: currentGame.gameState.currentPlayerId,
          playerCards: currentGame.gameState.player2cards,
          playerNames: currentGame.gameState.player2names,
          score: currentGame.gameState.score,
          status: currentGame.gameState.status,
          message: 'it\'s your turn, make a request',
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  };
  return { create, request, refresh };
}
