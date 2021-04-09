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
  let book = [];
  // check if there are any books, return book and remaiming cards in playerHand
  if (playerHand.length > 3) {
    for (let i = 0; i < playerHand.length - 3; i += 1) {
      if (playerHand[i].rank === playerHand[i + 3].rank) {
        book = playerHand.splice(i, i + 4);
        console.log('book', book);
        console.log('player 1 hand', playerHand);
      }
    }
    return { playerHand, book };
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

// gameplay functions
const getCardFromOpponent = (requestedName, currentPlayerHand, otherPlayerHand) => {
  for (let i = 0; i < otherPlayerHand.length; i += 1) {
    if (otherPlayerHand[i].name === requestedName) {
      const requestedCard = otherPlayerHand.splice(i, 1);
      console.log('requested card', requestedCard);
      console.log('other player hand', otherPlayerHand);
      currentPlayerHand.push(requestedCard[0]);
      console.log('current player hand', currentPlayerHand);
    }
  }

  // let cpCards;
  // let cpBook;
  // let currentPlayerNames;
  // let otherPlayerCards;
  // let otherPlayerNames;

  currentPlayerHand.sort((a, b) => a.rank - b.rank);
  console.log('sorted current player hand', currentPlayerHand);
  // check if there are any books in player1's hand
  const currentPlayerCards = findBooks(currentPlayerHand);
  const cpCards = currentPlayerCards.playerHand;
  const cpBook = currentPlayerCards.book;
  // get distinct names from updated player1 hand
  const currentPlayerNames = getDistinctNames(currentPlayerHand);
  // get updated player2 cards
  const otherPlayerCards = findBooks(otherPlayerHand);
  const opCards = otherPlayerCards.playerHand;
  console.log('other player cards', opCards);
  // get distinct names from updated player2's hand
  const otherPlayerNames = getDistinctNames(otherPlayerHand);

  return {
    cpCards, cpBook, currentPlayerNames, opCards, otherPlayerNames,
  };
};

const gotCardFromPool = (currentPlayerHand, cardFromPool) => {
  // let player2cards;
  // let player2names;

  currentPlayerHand.push(cardFromPool);
  currentPlayerHand.sort((a, b) => a.rank - b.rank);
  console.log('current player hand', currentPlayerHand);

  const currentPlayerCards = findBooks(currentPlayerHand);
  const cpCards = currentPlayerCards.playerHand;
  const cpBook = currentPlayerCards.book;

  const currentPlayerNames = getDistinctNames(currentPlayerHand);

  return { cpCards, cpBook, currentPlayerNames };
};
// check and update player hands after player request
// const checkAndUpdateHands = (otherPlayerNames, requestedName, otherPlayer, currentPlayer) => {
//   if (otherPlayerNames.includes(requestedName)) {
//     for (let i = 0; i < otherPlayer.length; i += 1) {
//     // if player 1's request matches player 2's cards
//       if (otherPlayer[i].rank == requestedName) {
//       // remove card from player 2's hand
//         const requestedCard = otherPlayer.splice(i, 1);
//         console.log('requested card', requestedCard);
//         console.log('other player hand', otherPlayer);
//         // add card to player 1's hand
//         currentPlayer.push(requestedCard[0]);
//         console.log('current player hand', currentPlayer);
//       // keep track of the number of cards moved from player 1 to 2
//       }
//     }
//   }
//   return { otherPlayer, currentPlayer };
// };

// game logic, opponent has cards requested
// const getCardFromOpponent = (playerHand, oPlayerHand, requestedName) => {
//   let player1cards;
//   let player1names;
//   let player2cards;
//   let player2names;

//   for (let i = 0; i < playerHand.length; i += 1) {
//     // if player 1's request matches player 2's cards
//     if (playerHand[i].name == requestedName) {
//       // remove card from player 2's hand
//       const requestedCard = playerHand.splice(i, 1);
//       console.log('requested card', requestedCard);
//       console.log('player 2 hand', playerHand);
//       // add card to player 1's hand
//       oPlayerHand.push(requestedCard[0]);
//       console.log('player 1 hand', oPlayerHand);
//     }
//   }

//   // sort updated player 1 hand
//   oPlayerHand.sort((a, b) => a.rank - b.rank);
//   console.log('sorrted player 1 hand:', oPlayerHand);
//   // check if there are any books in player1's hand
//   player1cards = findBooks(oPlayerHand);
//   // get distinct names from updated player1 hand
//   player1names = getDistinctNames(oPlayerHand);
//   // get updated player2 cards
//   player2cards = findBooks(playerHand);
//   // get distinct names from updated player2's hand
//   player2names = getDistinctNames(playerHand);
//   return {
//     player1cards, player1names, player2cards, player2names,
//   };
// };
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

    const player1winningbooks = [];
    // check to see if there are any books, return altered array if there is one, plus winning books
    const player1cards = findBooks(player1Hand);
    console.log(player1cards);
    if (player1cards.book) {
      player1winningbooks.push(player1cards.book);
    }

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

    const player2winningbooks = [];

    const player2cards = findBooks(player2Hand);
    console.log(player2cards);
    if (player2cards.book) {
      player2winningbooks.push(player2cards.book);
    }

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
            player1cards: player1cards.playerHand,
            player1winningbooks,
            player1names,
            player2cards: player2cards.playerHand,
            player2winningbooks,
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
          winningBooks: currentGame.gameState.player1winningbooks,
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
          winningBooks: currentGame.gameState.player2winningbooks,
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
      const player2Hand = currentGame.gameState.player2cards;
      const player1Hand = currentGame.gameState.player1cards;
      // get players' winning books from current game
      const { player2winningbooks } = currentGame.gameState;
      const { player1winningbooks } = currentGame.gameState;
      console.log('player 2 hand:', player2Hand);
      // get distinct names of players' cards
      const player2CardNames = currentGame.gameState.player2names;
      console.log('player 2 card names:', player2CardNames);
      const player1CardNames = currentGame.gameState.player1names;
      console.log('player 1 card names:', player1CardNames);

      // player 1's turn/ player 1 is current player
      if (Number(req.cookies.userId) === currentGame.gameState.player1 && Number(req.cookies.userId) === currentGame.gameState.currentPlayerId) {
        console.log('current player id:', currentGame.gameState.currentPlayerId);
        console.log(player2CardNames.includes(requestedName));
        if (player2CardNames.includes(requestedName)) {
          console.log(player2CardNames.includes(requestedName));
          //   // const cardFromOpponent = getCardFromOpponent(player1Hand, player2Hand, requestedName);
          //   // console.log('card from opponent', cardFromOpponent);
          //   for (let i = 0; i < player2Hand.length; i += 1) {
          //     // if player 1's request matches player 2's cards
          //     if (player2Hand[i].name == requestedName) {
          //       // remove card from player 2's hand
          //       const requestedCard = player2Hand.splice(i, 1);
          //       console.log('requested card', requestedCard);
          //       console.log('player 2 hand', player2Hand);
          //       // add card to player 1's hand
          //       player1Hand.push(requestedCard[0]);
          //       console.log('player 1 hand', player1Hand);
          //     }
          //   }

          //   // sort updated player 1 hand
          //   player1Hand.sort((a, b) => a.rank - b.rank);
          //   console.log('sorrted player 1 hand:', player1Hand);
          //   // check if there are any books in player1's hand
          //   const player1cards = findBooks(player1Hand);
          //   // get distinct names from updated player1 hand
          //   const player1names = getDistinctNames(player1Hand);
          //   // get updated player2 cards
          //   const player2cards = findBooks(player2Hand);
          //   // get distinct names from updated player2's hand
          //   const player2names = getDistinctNames(player2Hand);
          const player1turn = getCardFromOpponent(requestedName, player1Hand, player2Hand);
          console.log('player 1 turn', player1turn);
          console.log('player 1 turn. currentPlayerNAMES', player1turn.currentPlayerNames);

          if (player1turn.cpBook.length !== 0) {
            player1winningbooks.push(player1turn.cpBook);
          }

          // update game details in database
          const updatedGame = await currentGame.update({
            gameState: {
              status: 'active',
              player1: currentGame.gameState.player1,
              player2: currentGame.gameState.player2,
              currentPlayerId: currentGame.gameState.player1,
              cardDeck: currentGame.gameState.cardDeck,
              player1cards: player1turn.cpCards,
              player2cards: player1turn.opCards,
              player1winningbooks,
              player2winningbooks,
              player1names: player1turn.currentPlayerNames,
              player2names: player1turn.otherPlayerNames,
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
            playerCards: updatedGame.gameState.player1cards,
            playerNames: updatedGame.gameState.player1names,
            winningBooks: updatedGame.gameState.player1winningbooks,
            message: 'it\'s still your turn, make another request',
          });
        } else {
          // opponent doesn't have requested card, card is drawn from pool instead

          // get card from pool if player2 doesn't have requested name
          const cardFromPool = currentGame.gameState.cardDeck.pop();

          const player1turn = gotCardFromPool(player1Hand, cardFromPool);
          console.log('player 1 turn', player1turn);

          player1winningbooks.push(player1turn.cpBook);
          console.log('player 1 winning book', player1winningbooks);

          // console.log('number of cards left:', currentGame.gameState.cardDeck.length);
          // console.log('card from pool', cardFromPool);
          // // add card from pool to player1's hand
          // player1Hand.push(cardFromPool);
          // console.log('card taken from pool', player1Hand);
          // player1Hand.sort((a, b) => a.rank - b.rank);
          // console.log('sorted player 1 hand', player1Hand);
          // // check if there are any books in player1's hand
          // const player1cards = findBooks(player1Hand);
          // // get distinct names from updated player1 hand
          // const player1names = getDistinctNames(player1Hand);
          // // get updated player2 cards
          // const player2cards = findBooks(player2Hand);
          // // get distinct names from updated player2's hand
          // const player2names = getDistinctNames(player2Hand);

          // if the name of the card matches the player1's request, still player1's turn
          if (cardFromPool.name === requestedName) {
            const updatedGame = await currentGame.update({
              gameState: {
                status: 'active',
                player1: currentGame.gameState.player1,
                player2: currentGame.gameState.player2,
                currentPlayerId: currentGame.gameState.currentPlayerId,
                cardDeck: currentGame.gameState.cardDeck,
                player1cards: player1turn.cpCards,
                player1winningbooks: player1turn.cpBook,
                player1names: player1turn.currentPlayerNames,
                player2cards: currentGame.gameState.player2cards,
                player2names: currentGame.gameState.player2names,
                player2winningbooks: currentGame.gameState.player2winningbooks,
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
              playerCards: updatedGame.gameState.player1cards,
              playerNames: updatedGame.gameState.player1names,
              winningBooks: updatedGame.gameState.player1winningbooks,
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
                player1cards: player1turn.cpCards,
                player1names: player1turn.player1names,
                player1winningbooks,
                player2cards: currentGame.gameState.player2cards,
                player2names: currentGame.gameState.player2names,
                player2winningbooks: currentGame.gameState.player2winningbooks,
                score: {
                  player1: 0,
                  player2: 0,
                },
              },

            });
            // send message to frontend. player 1
            res.send({
              id: updatedGame.id,
              playerCards: updatedGame.player1cards,
              winningBooks: updatedGame.gameState.player1winningbooks,
              message: 'it is now player 2\'s turn',
            });
          }
        }
      } else if (Number(req.cookies.userId) === currentGame.gameState.player2 && Number(req.cookies.userId) === currentGame.gameState.currentPlayerId) {
        if (player1CardNames.includes(requestedName)) {
          const player2turn = getCardFromOpponent(requestedName, player2Hand, player1Hand);
          console.log('player 2 turn', player2turn);

          if (player2turn.cpBook) {
            player2winningbooks.push(player2turn.cpBook);
          }
          // const cardFromOpponent = getCardFromOpponent(player1Hand, player2Hand, requestedName);
          // console.log('card from opponent', cardFromOpponent);
          // for (let i = 0; i < player1Hand.length; i += 1) {
          //   // if player 2's request matches player 1's cards
          //   if (player1Hand[i].name == requestedName) {
          //     // remove card from player 2's hand
          //     const requestedCard = player1Hand.splice(i, 1);
          //     console.log('requested card', requestedCard);
          //     console.log('player 2 hand', player1Hand);
          //     // add card to player 2's hand
          //     player2Hand.push(requestedCard[0]);
          //     console.log('player 2 hand', player2Hand);
          //   }
          // }

          // // sort updated player 2 hand
          // player2Hand.sort((a, b) => a.rank - b.rank);
          // console.log('sorrted player 1 hand:', player1Hand);
          // // check if there are any books in player1's hand
          // const player2cards = findBooks(player1Hand);
          // // get distinct names from updated player1 hand
          // const player2names = getDistinctNames(player1Hand);
          // // get updated player2 cards
          // const player1cards = findBooks(player2Hand);
          // // get distinct names from updated player2's hand
          // const player1names = getDistinctNames(player2Hand);

          // update game details in database
          const updatedGame = await currentGame.update({
            gameState: {
              status: 'active',
              player1: currentGame.gameState.player1,
              player2: currentGame.gameState.player2,
              currentPlayerId: currentGame.gameState.player2,
              cardDeck: currentGame.gameState.cardDeck,
              player1cards: player2turn.opCards,
              player1names: player2turn.otherPlayerNames,
              player1winningbooks: currentGame.player1winningbooks,
              player2cards: player2turn.cpCards,
              player2names: player2turn.currentPlayerNames,
              player2winningbooks,
              score: {
                player1: 0,
                player2: 0,
              },
            },

          });
          console.log('updated game', updatedGame);
          // send player 2 info to frontend
          res.send({
            id: updatedGame.id,
            playerId: currentGame.gameState.player2,
            playerCards: updatedGame.gameState.player2cards,
            playerNames: updatedGame.gameState.player2names,
            winningBooks: updatedGame.gameState.player2winningbooks,
            message: 'it\'s still your turn, make another request',
          });
        } else {
          // get card from pool if player1 doesn't have requested name
          const cardFromPool = currentGame.gameState.cardDeck.pop();

          const player2turn = gotCardFromPool(player2Hand, player1Hand);
          if (player2turn.cpBook) {
            player2winningbooks.push(player2turn.cpBook);
            console.log('player 1 winning book', player1winningbooks);
          }
          // console.log('number of cards left:', currentGame.gameState.cardDeck.length);
          // console.log('card from pool', cardFromPool);
          // // add card from pool to player2's hand
          // player2Hand.push(cardFromPool);
          // console.log('card taken from pool', player2Hand);
          // player2Hand.sort((a, b) => a.rank - b.rank);
          // console.log('sorted player 2 hand', player2Hand);
          // // check if there are any books in player1's hand
          // const player2cards = findBooks(player2Hand);
          // // get distinct names from updated player1 hand
          // const player2names = getDistinctNames(player2Hand);
          // // get updated player2 cards
          // const player1cards = findBooks(player1Hand);
          // // get distinct names from updated player2's hand
          // const player1names = getDistinctNames(player1Hand);

          // if the name of the card matches the player2's request, still player2's turn
          if (cardFromPool.name === requestedName) {
            const updatedGame = await currentGame.update({
              gameState: {
                status: 'active',
                player1: currentGame.gameState.player1,
                player2: currentGame.gameState.player2,
                currentPlayerId: currentGame.gameState.currentPlayerId,
                cardDeck: currentGame.gameState.cardDeck,
                player1cards: player2turn.opCards,
                player1winningbooks: currentGame.gameState.player1winningbooks,
                player1names: player2turn.currentPlayerNames,
                player2cards: player2turn.cpCards,
                player2names: player2turn.currentPlayerNames,
                player2winningbooks,
                score: {
                  player1: 0,
                  player2: 0,
                },
              },

            });

            // send player 2 info to frontend
            res.send({
              id: updatedGame.id,
              playerId: updatedGame.gameState.player2,
              playerCards: updatedGame.gameState.player2cards,
              playerNames: updatedGame.gameState.player2names,
              winningBooks: updatedGame.gameState.player2winningbooks,
              message: 'it\'s still your turn, make another request',
            });
          } else {
            // if card from pool doesn't match player2's request,
            const updatedGame = await currentGame.update({
              gameState: {
                status: 'active',
                player1: currentGame.gameState.player1,
                player2: currentGame.gameState.player2,
                currentPlayerId: currentGame.gameState.player1,
                cardDeck: currentGame.gameState.cardDeck,
                player1cards: player2turn.opCards,
                player1winningbooks: currentGame.gameState.player1winningbooks,
                player1names: player2turn.currentPlayerNames,
                player2cards: player2turn.cpCards,
                player2names: player2turn.currentPlayerNames,
                player2winningbooks,
                score: {
                  player1: 0,
                  player2: 0,
                },
              },

            });
            // send message to frontend. player 2
            res.send({
              id: updatedGame.id,
              playerCards: updatedGame.player2cards,
              winningBooks: updatedGame.player2winningbooks,
              message: 'it is now player 1\'s turn',
            });
          }
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const refresh = async (req, res) => {
    console.log('game id:', req.body.gameId);
    const gameId = Number(req.body.gameId);
    try {
      const currentGame = await db.Game.findOne({
        where: {
          id: gameId,
        },
      });
      console.log('current game', currentGame);
      if (currentGame.gameState.currentPlayerId === Number(req.cookies.userId) && currentGame.gameState.player2 === Number(req.cookies.userId)) {
        res.send({
          id: currentGame.id,
          playerId: currentGame.gameState.player2,
          currentPlayerId: currentGame.gameState.currentPlayerId,
          playerCards: currentGame.gameState.player2cards,
          playerNames: currentGame.gameState.player2names,
          winningBooks: currentGame.gameState.player2winningbooks,
          score: currentGame.gameState.score,
          status: currentGame.gameState.status,
          message: 'it\'s your turn, make a request',
        });
      } else if (currentGame.gameState.currentPlayerId === Number(req.cookies.userId) && currentGame.gameState.player1 === Number(req.cookies.userId)) {
        res.send({
          id: currentGame.id,
          playerId: currentGame.gameState.player1,
          currentPlayerId: currentGame.gameState.currentPlayerId,
          playerCards: currentGame.gameState.player1cards,
          playerNames: currentGame.gameState.player1names,
          winningBooks: currentGame.gameState.player1winningbooks,
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
