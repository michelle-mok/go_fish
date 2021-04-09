import jsSHA from 'jssha';

export default function initUsersController(db) {
  // bypass login if user is already logged in
  const alreadyLoggedIn = async (req, res) => {
    const userId = Number(req.cookies.userId);
    if (!userId) {
      res.send('user needs to login');
    }

    try {
      const user = await db.User.findOne({
        where: {
          id: userId,
        },
      });
      const activeGame = await user.getGames({
        where: {
          gameState: { status: 'active' },
        },
      });
      // console.log('active game', activeGame[0].gameState);

      if (activeGame.length !== 0) {
        if (activeGame[0].gameState.player1 === Number(req.cookies.userId) && activeGame[0].gameState.currentPlayerId === Number(req.cookies.userId)) {
          res.send({
            id: activeGame[0].id,
            first_name: user.first_name,
            playerCards: activeGame[0].gameState.player1cards,
            playerNames: activeGame[0].gameState.player1names,
            message: 'It\'s your turn, make a request',
          });
        } else if (activeGame[0].gameState.player2 === Number(req.cookies.userId) && activeGame[0].gameState.currentPlayerId === Number(req.cookies.userId)) {
          res.send({
            id: activeGame[0].id,
            first_name: user.first_name,
            playerCards: activeGame[0].gameState.player2cards,
            playerNames: activeGame[0].gameState.player2names,
            message: 'It\'s your turn, make a request',
          });
        } else if (activeGame[0].gameState.player1 === Number(req.cookies.userId) && activeGame[0].gameState.currentPlayerId != Number(req.cookies.userId)) {
          res.send({
            id: activeGame[0].id,
            first_name: user.first_name,
            playerCards: activeGame[0].gameState.player1cards,
            message: 'Please wait for your turn',
          });
        } else {
          res.send({
            id: activeGame[0].id,
            first_name: user.first_name,
            playerCards: activeGame[0].gameState.player2cards,
            message: 'Please wait for your turn',
          });
        }
      } else if (activeGame.length === 0) {
        res.send({ user });
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  // logs user in
  const login = async (req, res) => {
    try {
      // query database for user's email

      const user = await db.User.findOne({
        where: {
          email: req.body.email,
        },
      });
      console.log('user password', user.password);

      // create hash password that matches user's hashed password
      const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
      shaObj.update(req.body.password);
      const hashedPassword = shaObj.getHash('HEX');
      console.log('hashed password', hashedPassword);

      // send user info if hashed passwords match
      if (hashedPassword === user.password) {
        res.cookie('loggedIn', true);
        res.cookie('userId', user.id);
        res.send({ user });
      } else {
        // send login unsuccessful message if hashed passwords do not match
        const unsucessfulLoginMsg = 'You are not logged in, please try again';
        console.log('not logged in ');
        res.send({ unsucessfulLoginMsg });
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  return { login, alreadyLoggedIn };
}
