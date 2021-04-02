import jsSHA from 'jssha';

export default function initUsersController(db) {
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

  return { login };
}
